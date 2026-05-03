"""
bbox-crop.py — recorta una foto al bbox del producto (según una máscara PNG
transparente de Bria) y la compone sobre fondo blanco al 70% con ~15% padding.

Uso:
    python scripts/bbox-crop.py <original.jpg> <mask.png> <out.jpg>

Resultado: JPG 1200x1600, producto centrado al 70% del lienzo, fondo blanco.
"""
import sys
from pathlib import Path
from PIL import Image

OUT_W, OUT_H = 1200, 1600
TARGET_RATIO = 0.70  # producto ocupa 70% del lado más largo
BG = (255, 255, 255)


def main():
    if len(sys.argv) != 4:
        print(__doc__)
        sys.exit(1)

    src_path = Path(sys.argv[1])
    mask_path = Path(sys.argv[2])
    out_path = Path(sys.argv[3])

    src = Image.open(src_path).convert("RGB")
    mask_img = Image.open(mask_path).convert("RGBA")

    # Asegurar misma resolución entre original y máscara
    if mask_img.size != src.size:
        mask_img = mask_img.resize(src.size, Image.LANCZOS)

    # Bbox del contenido no-transparente
    alpha = mask_img.split()[-1]
    bbox = alpha.getbbox()
    if not bbox:
        print(f"ERROR: máscara vacía ({mask_path})")
        sys.exit(2)

    cropped = src.crop(bbox)

    # Escalar al 70% del lado más largo del lienzo
    cw, ch = cropped.size
    target_long = int(max(OUT_W, OUT_H) * TARGET_RATIO)
    if cw >= ch:
        new_w = target_long
        new_h = int(ch * (target_long / cw))
    else:
        new_h = target_long
        new_w = int(cw * (target_long / ch))
    # Asegurar que cabe horizontalmente con margen
    max_w = int(OUT_W * 0.85)
    if new_w > max_w:
        scale = max_w / new_w
        new_w = max_w
        new_h = int(new_h * scale)

    cropped = cropped.resize((new_w, new_h), Image.LANCZOS)

    # Componer sobre lienzo blanco
    canvas = Image.new("RGB", (OUT_W, OUT_H), BG)
    paste_x = (OUT_W - new_w) // 2
    paste_y = (OUT_H - new_h) // 2

    # Aplicar la máscara recortada y reescalada para preservar bordes limpios
    mask_cropped = mask_img.crop(bbox).resize((new_w, new_h), Image.LANCZOS)
    canvas.paste(cropped, (paste_x, paste_y), mask_cropped.split()[-1])

    out_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out_path, "JPEG", quality=88, optimize=True)
    print(f"OK -> {out_path} ({OUT_W}x{OUT_H})")


if __name__ == "__main__":
    main()
