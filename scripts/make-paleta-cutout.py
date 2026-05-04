"""
Genera un cutout PNG (fondo transparente) del aviso paleta redondo para
usar en la lluvia del Hero (ProductRain.tsx).

Strategy:
  1. Toma el detail closeup que tiene el aviso bien centrado
  2. Aplica rembg (AI background removal)
  3. Crop al bounding box no-transparente
  4. Guarda en /img/products/2026/cutouts/paleta-redondo.png
"""
from rembg import remove
from PIL import Image
import io
from pathlib import Path

SRC = Path("C:/Users/User/Downloads/muffment-web/public/img/products/paleta-redondo-2-top.jpg")
OUT = Path("C:/Users/User/Downloads/muffment-web/public/img/products/2026/cutouts/paleta-redondo.png")
OUT.parent.mkdir(parents=True, exist_ok=True)

print(f"Procesando {SRC.name}...")
img_bytes = SRC.read_bytes()
out_bytes = remove(img_bytes)

# Cargar como PIL para crop al bbox
img = Image.open(io.BytesIO(out_bytes))
print(f"Original: {img.size} {img.mode}")

# Crop al bbox no-transparente
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)
    print(f"Cropped: {img.size}")

# Guardar
img.save(OUT, "PNG", optimize=True)
print(f"Guardado: {OUT} ({OUT.stat().st_size / 1024:.1f} KB)")
