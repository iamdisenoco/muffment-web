"""
Pre-genera variantes de color usando DUOTONE interpolation + rembg.

Uso (batch):
  python scripts/generate-color-variations.py plegable bent ov flag ...
  python scripts/generate-color-variations.py --all  (procesa todos los heros)

Pipeline por producto:
  1. rembg saca el producto con alpha smooth (sombras del piso = bajo,
     producto solido = alto)
  2. alpha < 0.30 -> 0 (elimina sombra del piso)
  3. alpha > 0.30 -> amplificado 1.6x (los reflejos mantienen color)
  4. Por cada color: tritono (shadow, mid, highlight) modulado por finish
  5. Composite final con blanco usando alpha amplificado
"""
import sys
import re
from pathlib import Path
import numpy as np
from PIL import Image
from rembg import remove, new_session

COLORS_TS = Path("C:/Users/User/Downloads/muffment-web/src/data/colors.ts")
text = COLORS_TS.read_text(encoding="utf-8")
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

IMG_DIR = Path("C:/Users/User/Downloads/muffment-web/public/img/products/2026")
OUT_DIR = Path("C:/Users/User/Downloads/muffment-web/public/img/products/colors")
OUT_DIR.mkdir(exist_ok=True, parents=True)

# Args: lista de slugs O --all
if len(sys.argv) > 1 and sys.argv[1] == "--all":
    # Todos los heros disponibles
    slugs = sorted([f.stem[:-2] for f in IMG_DIR.glob("*-1.jpg")])
else:
    slugs = sys.argv[1:] if len(sys.argv) > 1 else ["plegable"]
print(f"Slugs a procesar: {slugs}")

print("Init rembg session...")
session = new_session("isnet-general-use")

def hex_to_rgb01(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i+2], 16)/255 for i in (0, 2, 4)], dtype=np.float32)


def process_product(slug_prefix):
    src_path = IMG_DIR / f"{slug_prefix}-1.jpg"
    if not src_path.exists():
        print(f"SKIP {slug_prefix}: {src_path} no existe")
        return
    print(f"\n=== {slug_prefix} ===")
    img = Image.open(src_path).convert("RGB")
    arr = np.array(img).astype(np.float32) / 255.0
    H, W = arr.shape[:2]
    print(f"  Source: {W}x{H}")

    # rembg
    cutout = remove(img, session=session)
    alpha_arr = np.array(cutout)[:, :, 3].astype(np.float32) / 255.0
    alpha_arr[alpha_arr < 0.30] = 0
    alpha_blend = np.where(alpha_arr > 0.30, np.minimum(alpha_arr * 1.6, 1.0), 0.0)
    mask_prod = alpha_blend > 0

    if not mask_prod.any():
        print(f"  WARN: no se detecto producto, skip")
        return

    # Luminancia
    gray = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]
    gray_prod = gray[mask_prod]
    gray_min = float(np.percentile(gray_prod, 3))
    gray_max = float(np.percentile(gray_prod, 97))
    norm = np.clip((gray - gray_min) / max(gray_max - gray_min, 0.01), 0, 1)

    # Bbox
    ys, xs = np.where(mask_prod)
    x0, x1 = xs.min(), xs.max()
    y0, y1 = ys.min(), ys.max()
    pad = max(int(min(H, W) * 0.02), 8)
    x0 = max(0, x0 - pad); y0 = max(0, y0 - pad)
    x1 = min(W, x1 + pad); y1 = min(H, y1 + pad)
    bw, bh = x1 - x0, y1 - y0

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

    print(f"  Generando {len(COLORS)} variantes...")
    for i, (color_id, hex_str, finishes) in enumerate(COLORS):
        target = hex_to_rgb01(hex_str)
        target_lum = 0.299 * target[0] + 0.587 * target[1] + 0.114 * target[2]

        # Highlight strength por finish
        fset = set(finishes)
        if "brillante" in fset:
            highlight_strength = 0.85; shadow_strength = 0.18
        elif "semi-brillante" in fset or "destellos" in fset:
            highlight_strength = 0.65; shadow_strength = 0.22
        elif "semi-mate" in fset:
            highlight_strength = 0.45; shadow_strength = 0.28
        elif "texturizado" in fset or "microtexturizado" in fset or "micro-destellos" in fset:
            highlight_strength = 0.30; shadow_strength = 0.35
        elif "mate" in fset:
            highlight_strength = 0.25; shadow_strength = 0.40
        elif "interior" in fset:
            highlight_strength = 0.55; shadow_strength = 0.25
        else:
            highlight_strength = 0.50; shadow_strength = 0.25

        shadow = target * shadow_strength
        mid = target
        white = np.array([1.0, 1.0, 1.0], dtype=np.float32)
        if target_lum < 0.6:
            highlight = target + (white - target) * (highlight_strength * 0.95)
        else:
            highlight = target + (white - target) * highlight_strength

        n = norm_crop[:, :, np.newaxis]
        low_mask = n < 0.5
        out_low = shadow + (mid - shadow) * (n * 2)
        out_high = mid + (highlight - mid) * ((n - 0.5) * 2)
        out_rgb = np.where(low_mask, out_low, out_high)
        out_rgb = np.clip(out_rgb, 0, 1)

        a3 = alpha_blend_crop[:, :, np.newaxis]
        final = out_rgb * a3 + np.ones_like(out_rgb) * (1 - a3)
        out_img = (final * 255).clip(0, 255).astype(np.uint8)
        pil = Image.fromarray(out_img)
        resized = pil.resize((new_w, new_h), Image.LANCZOS)
        canvas = Image.new("RGB", (TARGET_SIZE, TARGET_SIZE), (255, 255, 255))
        canvas.paste(resized, (paste_x, paste_y))
        canvas.save(OUT_DIR / f"{slug_prefix}-{color_id}.jpg", "JPEG", quality=85, optimize=True)

    print(f"  Done")


for slug in slugs:
    process_product(slug)

print(f"\nTotal Done. Output: {OUT_DIR}")
