"""
Procesa las 3 fotos del 5423 (Doble Lamina Portable) desde HEIC del iPhone:
  HEIC -> RGB -> rembg cutout (isnet-general-use) -> autocrop -> blanco -> JPG

Salidas: doble-lamina-portable-1.jpg, -2.jpg, -3.jpg en /public/img/products/2026/

Las 3 fotos son del aviso real instalado al aire libre. Despues de rembg
queda con alpha. Pegamos sobre blanco puro (#FFFFFF) para que coincida
con el resto del catalogo (que es 100% blanco plano).
"""
from pathlib import Path
import pillow_heif
from PIL import Image, ImageOps
from rembg import remove, new_session

pillow_heif.register_heif_opener()
SESSION = new_session("isnet-general-use")

OUT_DIR = Path("C:/Users/User/Downloads/muffment-web/public/img/products/2026")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Mapeo HEIC -> nombre final
JOBS = [
    {"src": "C:/Users/User/Downloads/_zip_5423/IMG_8475.HEIC", "out": "doble-lamina-portable-1.jpg"},  # vista completa
    {"src": "C:/Users/User/Downloads/_zip_5423/IMG_8468.HEIC", "out": "doble-lamina-portable-2.jpg"},  # paneles
    {"src": "C:/Users/User/Downloads/_zip_5423/IMG_8470.HEIC", "out": "doble-lamina-portable-3.jpg"},  # detalle muffment
]


def process(job):
    src = Path(job["src"])
    out = OUT_DIR / job["out"]
    print(f"\nProcesando {src.name} -> {out.name}")

    img = Image.open(src)
    img = ImageOps.exif_transpose(img)
    img.thumbnail((2400, 2400), Image.LANCZOS)
    if img.mode != "RGB":
        img = img.convert("RGB")
    print(f"  size original (rotated): {img.size}")

    print("  removing background...")
    cutout = remove(img, session=SESSION)  # RGBA

    bbox = cutout.getbbox()
    if bbox:
        pad = max(int(min(cutout.size) * 0.04), 20)
        l = max(0, bbox[0] - pad)
        t = max(0, bbox[1] - pad)
        r = min(cutout.size[0], bbox[2] + pad)
        b = min(cutout.size[1], bbox[3] + pad)
        cutout = cutout.crop((l, t, r, b))
        print(f"  cropped to: {cutout.size}")

    cutout.thumbnail((1600, 1600), Image.LANCZOS)

    # Pega sobre blanco puro
    bg = Image.new("RGB", cutout.size, (255, 255, 255))
    bg.paste(cutout, mask=cutout.split()[3])
    bg.save(out, "JPEG", quality=90, optimize=True)
    print(f"  saved {out.name} ({out.stat().st_size / 1024:.1f} KB)")


for j in JOBS:
    process(j)

print("\nDone.")
