"""
Pre-genera variantes de color usando DUOTONE interpolation.

En lugar de hue rotation simple (que no funcionaba bien para negros y
colores casi iguales), usamos un mapeo de tono basado en la luminancia:

  - Pixels oscuros del producto -> tienden a negro/sombra
  - Pixels medios -> color target
  - Pixels claros (highlights) -> mezcla con blanco (highlight realista
    de superficie powder coated)

Esto es lo que hace Photoshop con "tritono" pero simplificado a 3
anchor points. El resultado se ve mucho mas realista que hue rotation.

Uso: python scripts/generate-color-variations.py plegable
"""
import sys
import re
from pathlib import Path
import numpy as np
from PIL import Image

COLORS_TS = Path("C:/Users/User/Downloads/muffment-web/src/data/colors.ts")
text = COLORS_TS.read_text(encoding="utf-8")
pattern = re.compile(r'\{\s*id:\s*"([\w-]+)".*?hex:\s*"(#[\w]+)"', re.DOTALL)
COLORS = [(m.group(1), m.group(2)) for m in pattern.finditer(text)]
print(f"Colores: {len(COLORS)}")

slug_prefix = sys.argv[1] if len(sys.argv) > 1 else "plegable"

IMG_DIR = Path("C:/Users/User/Downloads/muffment-web/public/img/products/2026")
OUT_DIR = Path("C:/Users/User/Downloads/muffment-web/public/img/products/colors")
OUT_DIR.mkdir(exist_ok=True, parents=True)
src_path = IMG_DIR / f"{slug_prefix}-1.jpg"
if not src_path.exists():
    print(f"ERROR: {src_path}")
    sys.exit(1)

img = Image.open(src_path).convert("RGB")
arr = np.array(img).astype(np.float32) / 255.0
H, W = arr.shape[:2]
print(f"Source: {W}x{H}")

# Mask del producto: NOT blanco/sombra suave
# Fondo = V > 0.93 AND S < 0.10 (white + soft shadows)
maxc = np.max(arr, axis=2)
minc = np.min(arr, axis=2)
v_arr = maxc
s_arr = np.where(maxc > 0, (maxc - minc) / (maxc + 1e-10), 0)
fondo = (v_arr > 0.93) & (s_arr < 0.10)
mask_prod = ~fondo

# Limpieza: erosionar/dilatar para quitar pixels sueltos (sombras stray)
from scipy.ndimage import binary_opening, binary_closing
mask_prod = binary_closing(mask_prod, iterations=2)
mask_prod = binary_opening(mask_prod, iterations=1)
print(f"Producto: {mask_prod.sum()} pixels ({mask_prod.mean()*100:.1f}%)")

# Escala de gris percibida
gray = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]

# Min/max de luminancia del producto (percentiles para robustez)
gray_prod = gray[mask_prod]
gray_min = float(np.percentile(gray_prod, 3))
gray_max = float(np.percentile(gray_prod, 97))
print(f"Gray range: {gray_min:.3f} - {gray_max:.3f}")

# Normalizar gray del producto a [0, 1] - 0 = mas oscuro, 1 = highlight
norm = np.clip((gray - gray_min) / max(gray_max - gray_min, 0.01), 0, 1)

# Bbox para crop
ys, xs = np.where(mask_prod)
x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
pad = max(int(min(H, W) * 0.02), 8)
x0 = max(0, x0 - pad); y0 = max(0, y0 - pad)
x1 = min(W, x1 + pad); y1 = min(H, y1 + pad)
bw, bh = x1 - x0, y1 - y0

# Crop arrays
norm_crop = norm[y0:y1, x0:x1]
mask_crop = mask_prod[y0:y1, x0:x1]

TARGET_SIZE = 1200
TARGET_FILL = 0.78
target_long = int(TARGET_SIZE * TARGET_FILL)
scale = target_long / max(bw, bh)
new_w, new_h = int(bw * scale), int(bh * scale)
paste_x = (TARGET_SIZE - new_w) // 2
paste_y = (TARGET_SIZE - new_h) // 2

def hex_to_rgb01(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i+2], 16)/255 for i in (0, 2, 4)], dtype=np.float32)

print(f"\nGenerando {len(COLORS)} variantes...")
for i, (color_id, hex_str) in enumerate(COLORS):
    target = hex_to_rgb01(hex_str)
    target_lum = 0.299 * target[0] + 0.587 * target[1] + 0.114 * target[2]

    # Tritono anchor points:
    # shadow: target * 0.25 (muy oscuro, casi negro tintado)
    # mid: target (color base)
    # highlight: mezcla target + blanco (acabado powder coated brillante)
    shadow = target * 0.20
    mid = target
    # Para colores OSCUROS: highlight = mas claro pero no blanco puro
    # Para colores CLAROS: highlight = blanco casi puro con leve tinte
    if target_lum < 0.3:
        # negros/oscuros: highlight gris claro, no blanco
        highlight = np.minimum(target + 0.45, np.array([0.55, 0.55, 0.55], dtype=np.float32))
    elif target_lum < 0.6:
        highlight = target * 0.4 + np.array([0.6, 0.6, 0.6]) * 0.6
    else:
        # claros: highlight casi blanco
        highlight = target * 0.3 + np.array([1.0, 1.0, 1.0]) * 0.7

    # Interpolacion 3-pt: norm 0 -> shadow, 0.5 -> mid, 1 -> highlight
    out_rgb = np.zeros((mask_crop.shape[0], mask_crop.shape[1], 3), dtype=np.float32)
    # Vectorizar:
    n = norm_crop[:, :, np.newaxis]  # H,W,1
    low_mask = n < 0.5
    # Para low_mask: lerp(shadow, mid, n * 2)
    out_low = shadow + (mid - shadow) * (n * 2)
    # Para high_mask: lerp(mid, highlight, (n - 0.5) * 2)
    out_high = mid + (highlight - mid) * ((n - 0.5) * 2)
    out_rgb = np.where(low_mask, out_low, out_high)
    out_rgb = np.clip(out_rgb, 0, 1)

    # Fondo = blanco. Solo aplicar tinte donde mask_prod
    final = np.ones_like(out_rgb)
    final[mask_crop] = out_rgb[mask_crop]

    out_img = (final * 255).clip(0, 255).astype(np.uint8)
    pil = Image.fromarray(out_img)
    resized = pil.resize((new_w, new_h), Image.LANCZOS)

    canvas = Image.new("RGB", (TARGET_SIZE, TARGET_SIZE), (255, 255, 255))
    canvas.paste(resized, (paste_x, paste_y))
    canvas.save(OUT_DIR / f"{slug_prefix}-{color_id}.jpg", "JPEG", quality=85, optimize=True)
    if (i + 1) % 20 == 0:
        print(f"  [{i+1}/{len(COLORS)}] {color_id}")

print(f"\nDone. {len(COLORS)} variantes en {OUT_DIR}")
