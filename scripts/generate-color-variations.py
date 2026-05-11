"""
Pre-genera variantes de color de un producto para el ColorPicker.

Para el HERO (-1.jpg) de un producto:
  1. rembg saca el producto con alpha (una sola vez)
  2. Detecta el HUE base del producto
  3. Por cada color en colors.ts:
       - Aplica HSV recolor preservando V (luminancia) original
       - Compone sobre canvas blanco 1200x1200 al 78% fill
       - Guarda como public/img/products/colors/{slug}-{color-id}.jpg

Uso:
  python scripts/generate-color-variations.py plegable hablador-piso-plegable
"""
import sys
import re
from pathlib import Path
import numpy as np
from PIL import Image
from rembg import remove, new_session

# Leer colors.ts y extraer {id, hex}
COLORS_TS = Path("C:/Users/User/Downloads/muffment-web/src/data/colors.ts")
text = COLORS_TS.read_text(encoding="utf-8")
# Regex: { id: "xxx", name: "...", family: "...", hex: "#xxxxxx",
pattern = re.compile(r'\{\s*id:\s*"([\w-]+)".*?hex:\s*"(#[\w]+)"', re.DOTALL)
COLORS = [(m.group(1), m.group(2)) for m in pattern.finditer(text)]
print(f"Colores: {len(COLORS)}")

# Args
slug_prefix = sys.argv[1] if len(sys.argv) > 1 else "plegable"  # ej "plegable"

# Paths
IMG_DIR = Path("C:/Users/User/Downloads/muffment-web/public/img/products/2026")
OUT_DIR = Path("C:/Users/User/Downloads/muffment-web/public/img/products/colors")
OUT_DIR.mkdir(exist_ok=True, parents=True)

src_path = IMG_DIR / f"{slug_prefix}-1.jpg"
if not src_path.exists():
    print(f"ERROR: {src_path} no existe")
    sys.exit(1)
print(f"Source: {src_path}")

# ============ 1) rembg para sacar producto con alpha ============
print("Running rembg (puede tomar 1-2 minutos para 1 imagen)...")
session = new_session("isnet-general-use")
img = Image.open(src_path).convert("RGB")
cutout = remove(img, session=session)  # RGBA
arr = np.array(cutout)
alpha = arr[:, :, 3]
mask_strict = alpha > 150

ys, xs = np.where(mask_strict)
x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
pad = max(int(min(arr.shape[:2]) * 0.02), 8)
x0 = max(0, x0 - pad); y0 = max(0, y0 - pad)
x1 = min(arr.shape[1], x1 + pad); y1 = min(arr.shape[0], y1 + pad)
cropped_rgba = cutout.crop((x0, y0, x1, y1))
print(f"Cropped: {cropped_rgba.size}")

# Convertir cropped a numpy para procesamiento rapido
crop_arr = np.array(cropped_rgba)  # H,W,4
rgb = crop_arr[:, :, :3].astype(np.float32)
a = crop_arr[:, :, 3]

# Luminance original (escala de gris percibida)
luminance = (0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2])
# Normalizar luminancia del producto al rango [0.55, 1.15] para mantener
# detalle de sombras + reflejos sin sobrexponer
mask_product = a > 80
if mask_product.any():
    lum_vals = luminance[mask_product]
    lum_min, lum_max = float(np.percentile(lum_vals, 5)), float(np.percentile(lum_vals, 95))
else:
    lum_min, lum_max = 0.0, 255.0
print(f"Luminance range: {lum_min:.0f} - {lum_max:.0f}")

# Canvas/scale targets
TARGET_SIZE = 1200
TARGET_FILL = 0.78
bw, bh = cropped_rgba.size
target_long = int(TARGET_SIZE * TARGET_FILL)
scale = target_long / max(bw, bh)
new_w, new_h = int(bw * scale), int(bh * scale)
paste_x = (TARGET_SIZE - new_w) // 2
paste_y = (TARGET_SIZE - new_h) // 2

# ============ 2) Por cada color: recolor ============
def hex_to_rgb(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i+2], 16) for i in (0, 2, 4)], dtype=np.float32)

print(f"\nGenerando {len(COLORS)} variantes...")
for i, (color_id, hex_str) in enumerate(COLORS):
    target_rgb = hex_to_rgb(hex_str)

    # Modular luminancia normalizada [0.55, 1.15]
    # 0.55: zonas oscuras del producto
    # 1.15: zonas claras (reflejos)
    norm_lum = np.clip((luminance - lum_min) / max(lum_max - lum_min, 1), 0, 1)
    modulation = 0.55 + 0.60 * norm_lum  # rango [0.55, 1.15]
    modulation = np.clip(modulation, 0, 1.4)

    # Apply: result = target * modulation
    new_rgb = np.stack([
        target_rgb[0] * modulation,
        target_rgb[1] * modulation,
        target_rgb[2] * modulation,
    ], axis=-1)
    new_rgb = np.clip(new_rgb, 0, 255).astype(np.uint8)

    # Combinar con alpha original
    new_rgba = np.dstack([new_rgb, a]).astype(np.uint8)
    new_img = Image.fromarray(new_rgba, mode="RGBA")
    resized = new_img.resize((new_w, new_h), Image.LANCZOS)

    canvas = Image.new("RGB", (TARGET_SIZE, TARGET_SIZE), (255, 255, 255))
    canvas.paste(resized, (paste_x, paste_y), mask=resized.split()[3])

    out = OUT_DIR / f"{slug_prefix}-{color_id}.jpg"
    canvas.save(out, "JPEG", quality=85, optimize=True)
    if (i + 1) % 10 == 0:
        print(f"  [{i+1}/{len(COLORS)}] {color_id}")

print(f"\nDone. {len(COLORS)} variantes en {OUT_DIR}")
