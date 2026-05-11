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
from rembg import remove, new_session

COLORS_TS = Path("C:/Users/User/Downloads/muffment-web/src/data/colors.ts")
text = COLORS_TS.read_text(encoding="utf-8")
# Parse cada color con su id, hex y finishes
pattern = re.compile(
    r'\{\s*id:\s*"([\w-]+)".*?hex:\s*"(#[\w]+)".*?finishes:\s*\[([^\]]+)\]',
    re.DOTALL,
)
COLORS = []
for m in pattern.finditer(text):
    cid, hex_str, finishes_str = m.group(1), m.group(2), m.group(3)
    finishes = [f.strip().strip('"') for f in finishes_str.split(",") if f.strip()]
    COLORS.append((cid, hex_str, finishes))
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

# rembg saca el producto con alpha SMOOTH (sombras del piso = alpha bajo,
# producto solido = alpha alto, reflejos = alpha medio-alto)
print("Running rembg (1-2 min)...")
session = new_session("isnet-general-use")
cutout = remove(img, session=session)
alpha_arr = np.array(cutout)[:, :, 3].astype(np.float32) / 255.0
# La sombra del piso queda con alpha < 0.3. La pisamos a 0 para
# eliminarla completamente.
alpha_arr[alpha_arr < 0.30] = 0
# AMPLIFICAR opacidad: cualquier pixel con alpha > 0.30 lo subimos al
# nivel solido. Asi los reflejos (que rembg detectaba como semi-
# transparentes) NO se mezclan con blanco - mantienen color completo.
# Solo el "feather" finisimo del borde queda smooth.
alpha_blend = np.where(alpha_arr > 0.30, np.minimum(alpha_arr * 1.6, 1.0), 0.0)
mask_prod = alpha_blend > 0
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
alpha_blend_crop = alpha_blend[y0:y1, x0:x1]

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
for i, (color_id, hex_str, finishes) in enumerate(COLORS):
    target = hex_to_rgb01(hex_str)
    target_lum = 0.299 * target[0] + 0.587 * target[1] + 0.114 * target[2]

    # Detectar finish dominante para modular contraste y reflejo
    fset = set(finishes)
    if "brillante" in fset:
        # Brillante: highlight muy alto, contraste maximo
        highlight_strength = 0.85
        shadow_strength = 0.18
    elif "semi-brillante" in fset or "destellos" in fset:
        highlight_strength = 0.65
        shadow_strength = 0.22
    elif "semi-mate" in fset:
        highlight_strength = 0.45
        shadow_strength = 0.28
    elif "texturizado" in fset or "microtexturizado" in fset or "micro-destellos" in fset:
        # Texturas matifican: highlight muy bajo, contraste minimo
        highlight_strength = 0.30
        shadow_strength = 0.35
    elif "mate" in fset:
        highlight_strength = 0.25
        shadow_strength = 0.40
    elif "interior" in fset:
        highlight_strength = 0.55
        shadow_strength = 0.25
    else:
        highlight_strength = 0.50
        shadow_strength = 0.25

    # Tritono anchor points moduladas por finish:
    shadow = target * shadow_strength
    mid = target
    # Highlight: mix target con un "color highlight" segun luminancia
    # del target. Para negros brillantes, highlight muy alto = mucho contraste.
    # Para colores mate, highlight cercano al mid (poco contraste).
    if target_lum < 0.3:
        # Oscuros: highlight strength controla cuanto brillo (max gris claro)
        highlight_color = np.array([1.0, 1.0, 1.0], dtype=np.float32)
        # Para brillante: hasta blanco. Para mate: solo un poco mas claro que target.
        highlight = target + (highlight_color - target) * highlight_strength
    elif target_lum < 0.6:
        highlight_color = np.array([1.0, 1.0, 1.0], dtype=np.float32)
        highlight = target + (highlight_color - target) * (highlight_strength * 0.9)
    else:
        highlight_color = np.array([1.0, 1.0, 1.0], dtype=np.float32)
        highlight = target + (highlight_color - target) * highlight_strength

    # Interpolacion 3-pt: norm 0 -> shadow, 0.5 -> mid, 1 -> highlight
    out_rgb = np.zeros((mask_crop.shape[0], mask_crop.shape[1], 3), dtype=np.float32)
    n = norm_crop[:, :, np.newaxis]
    low_mask = n < 0.5
    out_low = shadow + (mid - shadow) * (n * 2)
    out_high = mid + (highlight - mid) * ((n - 0.5) * 2)
    out_rgb = np.where(low_mask, out_low, out_high)
    out_rgb = np.clip(out_rgb, 0, 1)

    # Composite con blanco usando alpha smooth:
    # alpha=1 (producto solido) -> color completo
    # alpha=0 (fondo + sombra piso) -> blanco puro
    # alpha intermedio (bordes/reflejos blandos) -> blend suave
    a3 = alpha_blend_crop[:, :, np.newaxis]
    final = out_rgb * a3 + np.ones_like(out_rgb) * (1 - a3)

    out_img = (final * 255).clip(0, 255).astype(np.uint8)
    pil = Image.fromarray(out_img)
    resized = pil.resize((new_w, new_h), Image.LANCZOS)

    canvas = Image.new("RGB", (TARGET_SIZE, TARGET_SIZE), (255, 255, 255))
    canvas.paste(resized, (paste_x, paste_y))
    canvas.save(OUT_DIR / f"{slug_prefix}-{color_id}.jpg", "JPEG", quality=85, optimize=True)
    if (i + 1) % 20 == 0:
        print(f"  [{i+1}/{len(COLORS)}] {color_id}")

print(f"\nDone. {len(COLORS)} variantes en {OUT_DIR}")
