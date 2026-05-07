"""
Genera cutouts PNG con alpha desde HEIC + fix de flag.

Pipeline mejorado:
  1. (HEIC) decodifica con pillow_heif -> RGB
  2. rembg.remove() con modelo `isnet-general-use` (mas preciso que default)
     y alpha_matting para edges limpios
  3. autocrop al bounding box (con padding generoso)
  4. Save como PNG con alpha
"""
import io
from pathlib import Path

import pillow_heif
from PIL import Image
from rembg import remove, new_session

pillow_heif.register_heif_opener()

# Modelo isnet-general-use — mejor que el u2net default para edges limpios.
SESSION = new_session("isnet-general-use")

OUT_DIR = Path("C:/Users/User/Downloads/muffment-web/public/img/products/2026/cutouts")
OUT_DIR.mkdir(parents=True, exist_ok=True)

JOBS = [
    {
        "id": "doble-lamina",
        "src": "C:/Users/User/Downloads/_doble-lamina-extracted/IMG_8472.heic",
    },
    {
        # Mesa A-Frame: SOLO la mesa de la izquierda.
        "id": "mesa-a-frame",
        "src": "C:/Users/User/Downloads/_mesa-a-frame-extracted/IMG_8330.heic",
        "pre_crop": (0.05, 0.10, 0.55, 0.95),
    },
    {
        "id": "swinger",
        "src": "C:/Users/User/Downloads/_swinger-extracted/IMG_7257.heic",
    },
    # flag se procesa via fix-flag-from-silueta.py (silueta -> colorize)
]

def process(job):
    src = Path(job["src"])
    out = OUT_DIR / f"{job['id']}.png"
    print(f"Procesando {job['id']} <- {src.name}")

    img = Image.open(src)
    if hasattr(img, "_getexif") and img._getexif():
        # rotate via EXIF si aplica
        from PIL import ImageOps
        img = ImageOps.exif_transpose(img)

    # max 2400 en lado mas largo para acelerar rembg
    img.thumbnail((2400, 2400), Image.LANCZOS)

    if img.mode != "RGB":
        img = img.convert("RGB")

    # Pre-crop si esta especificado
    if "pre_crop" in job:
        W, H = img.size
        x0, y0, x1, y1 = job["pre_crop"]
        img = img.crop((int(W * x0), int(H * y0), int(W * x1), int(H * y1)))
        print(f"  pre-cropped to: {img.size}")

    print(f"  size: {img.size}, removing background...")
    # SIN alpha_matting — el alpha matting hacia transparentes las
    # superficies solidas grandes (como el panel del flag).
    cutout = remove(img, session=SESSION)

    # autocrop al bounding box del contenido visible (alpha > 10)
    bbox = cutout.getbbox()
    if bbox:
        # padding del 5% en cada lado
        pad = max(int(min(cutout.size) * 0.04), 20)
        l = max(0, bbox[0] - pad)
        t = max(0, bbox[1] - pad)
        r = min(cutout.size[0], bbox[2] + pad)
        b = min(cutout.size[1], bbox[3] + pad)
        cutout = cutout.crop((l, t, r, b))
        print(f"  cropped to: {cutout.size}")

    # max 1200 final
    cutout.thumbnail((1200, 1200), Image.LANCZOS)
    cutout.save(out, "PNG", optimize=True)
    print(f"  -> {out.name} ({out.stat().st_size / 1024:.1f} KB)")

for job in JOBS:
    process(job)

print("Done.")
