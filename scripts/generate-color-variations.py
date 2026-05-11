"""
Pre-genera variantes de color de un producto usando HUE rotation en HSV.

Tecnica: en vez de mask alpha + recolor (que dejaba sombras raras o huecos
en reflejos), trabajamos directo en HSV:
  - Mask = todo lo que NO es blanco puro del fondo
  - Para cada pixel del producto:
      * Reemplazar HUE por el del color destino
      * Escalar S y V proporcionalmente al color destino
  - Esto preserva reflejos, sombras, contraste original

Uso:
  python scripts/generate-color-variations.py plegable
"""
import sys
import re
from pathlib import Path
import numpy as np
from PIL import Image
import colorsys

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
arr = np.array(img).astype(np.float32) / 255.0  # [H,W,3] en [0,1]
H, W = arr.shape[:2]
print(f"Source: {W}x{H}")

# Convertir a HSV usando opencv-like
# r,g,b -> h,s,v
r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
maxc = np.max(arr, axis=2)
minc = np.min(arr, axis=2)
v_arr = maxc
delta = maxc - minc + 1e-10
s_arr = np.where(maxc > 0, delta / maxc, 0)
# Hue
rc = (maxc - r) / delta
gc = (maxc - g) / delta
bc = (maxc - b) / delta
h_arr = np.zeros_like(maxc)
mask_r = (r == maxc)
mask_g = (g == maxc) & ~mask_r
mask_b = (b == maxc) & ~mask_r & ~mask_g
h_arr[mask_r] = bc[mask_r] - gc[mask_r]
h_arr[mask_g] = 2.0 + rc[mask_g] - bc[mask_g]
h_arr[mask_b] = 4.0 + gc[mask_b] - rc[mask_b]
h_arr = (h_arr / 6.0) % 1.0

# Mask del producto: NOT blanco puro
# Blanco puro = V > 0.98 AND S < 0.04
fondo = (v_arr > 0.98) & (s_arr < 0.04)
mask_prod = ~fondo
print(f"Producto: {mask_prod.sum()} pixels ({mask_prod.mean()*100:.1f}%)")

# HUE base del producto (promedio de pixels saturados)
mask_strong = mask_prod & (s_arr > 0.3)
if mask_strong.any():
    src_hues = h_arr[mask_strong]
    # Promedio circular usando coordenadas polares
    avg_x = np.mean(np.cos(src_hues * 2 * np.pi))
    avg_y = np.mean(np.sin(src_hues * 2 * np.pi))
    src_hue = (np.arctan2(avg_y, avg_x) / (2 * np.pi)) % 1.0
    src_sat_avg = float(np.median(s_arr[mask_strong]))
else:
    src_hue, src_sat_avg = 0.15, 0.8  # default amarillo
print(f"Source HUE: {src_hue:.3f} ({src_hue*360:.0f} deg), saturation avg: {src_sat_avg:.2f}")

# Pre-calcular canvas target
TARGET_SIZE = 1200
TARGET_FILL = 0.78

def hex_to_hsv(h):
    h = h.lstrip("#")
    r, g, b = [int(h[i:i+2], 16)/255 for i in (0, 2, 4)]
    return colorsys.rgb_to_hsv(r, g, b)

def hsv_to_rgb_arrays(h, s, v):
    """HSV arrays -> RGB arrays. Todo en [0,1]."""
    h6 = h * 6.0
    i = np.floor(h6).astype(int)
    f = h6 - i
    p = v * (1.0 - s)
    q = v * (1.0 - s * f)
    t = v * (1.0 - s * (1.0 - f))
    i = i % 6
    r = np.zeros_like(v); g = np.zeros_like(v); b = np.zeros_like(v)
    cond0 = i == 0; cond1 = i == 1; cond2 = i == 2
    cond3 = i == 3; cond4 = i == 4; cond5 = i == 5
    r[cond0] = v[cond0]; g[cond0] = t[cond0]; b[cond0] = p[cond0]
    r[cond1] = q[cond1]; g[cond1] = v[cond1]; b[cond1] = p[cond1]
    r[cond2] = p[cond2]; g[cond2] = v[cond2]; b[cond2] = t[cond2]
    r[cond3] = p[cond3]; g[cond3] = q[cond3]; b[cond3] = v[cond3]
    r[cond4] = t[cond4]; g[cond4] = p[cond4]; b[cond4] = v[cond4]
    r[cond5] = v[cond5]; g[cond5] = p[cond5]; b[cond5] = q[cond5]
    return r, g, b

# Detectar bbox del producto para crop
ys, xs = np.where(mask_prod)
x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
pad = max(int(min(H, W) * 0.02), 8)
x0 = max(0, x0 - pad); y0 = max(0, y0 - pad)
x1 = min(W, x1 + pad); y1 = min(H, y1 + pad)
bw, bh = x1 - x0, y1 - y0
print(f"Crop bbox: {bw}x{bh}")

# Crop todos los arrays
h_crop = h_arr[y0:y1, x0:x1]
s_crop = s_arr[y0:y1, x0:x1]
v_crop = v_arr[y0:y1, x0:x1]
mask_crop = mask_prod[y0:y1, x0:x1]

target_long = int(TARGET_SIZE * TARGET_FILL)
scale = target_long / max(bw, bh)
new_w, new_h = int(bw * scale), int(bh * scale)
paste_x = (TARGET_SIZE - new_w) // 2
paste_y = (TARGET_SIZE - new_h) // 2

print(f"\nGenerando {len(COLORS)} variantes...")
for i, (color_id, hex_str) in enumerate(COLORS):
    th, ts, tv = hex_to_hsv(hex_str)

    # Reemplazo HUE: nuevo HUE = target HUE
    new_h_arr = np.full_like(h_crop, th)

    # Escalar saturacion: el producto original tenia src_sat_avg, el destino tiene ts
    # new_S = orig_S * (target_S / source_S)
    sat_scale = ts / max(src_sat_avg, 0.05)
    new_s = np.clip(s_crop * sat_scale, 0, 1)
    # Para colores casi neutros (blancos, grises), pisar saturacion mas
    if ts < 0.15:
        new_s = s_crop * ts  # mantener algo de variacion pero muy baja sat

    # Escalar V: mantener V original modulado por target V
    # Si el target es muy oscuro (ej. negro): bajar V proporcionalmente
    # Si es claro: mantener V cercano al original
    v_scale_factor = 0.5 + 0.5 * tv  # target V 0 -> 0.5, target V 1 -> 1.0
    new_v = np.clip(v_crop * v_scale_factor + (tv - 0.5) * 0.15, 0, 1)

    nr, ng, nb = hsv_to_rgb_arrays(new_h_arr, new_s, new_v)

    # Componer: producto = nuevos valores, fondo = blanco
    out = np.stack([nr, ng, nb], axis=-1)
    out[~mask_crop] = 1.0  # fondo blanco

    out_img = (out * 255).clip(0, 255).astype(np.uint8)
    pil = Image.fromarray(out_img)
    resized = pil.resize((new_w, new_h), Image.LANCZOS)

    canvas = Image.new("RGB", (TARGET_SIZE, TARGET_SIZE), (255, 255, 255))
    canvas.paste(resized, (paste_x, paste_y))
    canvas.save(OUT_DIR / f"{slug_prefix}-{color_id}.jpg", "JPEG", quality=85, optimize=True)
    if (i + 1) % 20 == 0:
        print(f"  [{i+1}/{len(COLORS)}] {color_id}")

print(f"\nDone. {len(COLORS)} variantes en {OUT_DIR}")
