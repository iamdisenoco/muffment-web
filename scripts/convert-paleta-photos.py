"""
Convierte las HEIC de aviso paleta redondo a JPEG, genera variantes
(closeups + ajustes de exposición) y las guarda en public/img/products/.

Variantes por foto:
  - hero: full image, ligera mejora de contraste y saturación
  - closeup-top: crop top portion (frame redondo + post superior)
  - closeup-detail: crop center-zoom (~60% del original, centrado)
  - closeup-base: crop bottom (base del aviso, suelo)
"""
import pillow_heif
from PIL import Image, ImageEnhance, ImageOps
from pathlib import Path

pillow_heif.register_heif_opener()

SRC = Path("C:/Users/User/Downloads/_paleta-redondo-extracted")
OUT = Path("C:/Users/User/Downloads/muffment-web/public/img/products")
OUT.mkdir(parents=True, exist_ok=True)

# Mapping: cada HEIC -> nombre base para los outputs
PHOTOS = {
    "IMG_7077.HEIC": "paleta-redondo-1",
    "IMG_7078.HEIC": "paleta-redondo-2",
    "IMG_7079.HEIC": "paleta-redondo-3",
    "IMG_7080.HEIC": "paleta-redondo-4",
}

def enhance(img):
    """Slight color/contrast bump + sharpen para que se vean mejor."""
    img = ImageOps.exif_transpose(img)
    # Subimos contraste +12%
    img = ImageEnhance.Contrast(img).enhance(1.12)
    # Saturación +18%
    img = ImageEnhance.Color(img).enhance(1.18)
    # Brillo +5%
    img = ImageEnhance.Brightness(img).enhance(1.05)
    # Sharpness +30%
    img = ImageEnhance.Sharpness(img).enhance(1.30)
    return img

def save_jpeg(img, path, max_dim=2200, quality=88):
    # Resize si es demasiado grande
    w, h = img.size
    if max(w, h) > max_dim:
        scale = max_dim / max(w, h)
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    img.convert("RGB").save(path, "JPEG", quality=quality, optimize=True)

for src_name, base in PHOTOS.items():
    src_path = SRC / src_name
    if not src_path.exists():
        print(f"SKIP {src_name} — no existe")
        continue

    img = Image.open(src_path)
    img = enhance(img)
    w, h = img.size
    print(f"{src_name}: {w}x{h}")

    # 1) HERO — full image enhanced
    save_jpeg(img.copy(), OUT / f"{base}.jpg", max_dim=2400, quality=90)

    # 2) CLOSEUP-TOP — top portion (frame redondo del aviso)
    top = img.crop((int(w * 0.18), int(h * 0.05), int(w * 0.82), int(h * 0.55)))
    save_jpeg(top, OUT / f"{base}-top.jpg", max_dim=1800, quality=88)

    # 3) CLOSEUP-DETAIL — zoom central (centro del frame, donde va el arte)
    crop_size = min(w, h) * 0.55
    cx, cy = w / 2, h * 0.4
    detail = img.crop((
        int(cx - crop_size / 2),
        int(cy - crop_size / 2),
        int(cx + crop_size / 2),
        int(cy + crop_size / 2),
    ))
    save_jpeg(detail, OUT / f"{base}-detail.jpg", max_dim=1600, quality=88)

    # 4) CLOSEUP-ANGLE — vista angulada (crop slightly off-center, abajo
    #    izquierda) para variar el ángulo
    angle_w = int(w * 0.65)
    angle_h = int(h * 0.65)
    ax = int(w * 0.10)
    ay = int(h * 0.30)
    angle = img.crop((ax, ay, ax + angle_w, ay + angle_h))
    # Ligera rotación para variar el ángulo
    angle = angle.rotate(-2, expand=False, resample=Image.BICUBIC)
    save_jpeg(angle, OUT / f"{base}-angle.jpg", max_dim=1800, quality=88)

print(f"\nDone. Output: {OUT}")
