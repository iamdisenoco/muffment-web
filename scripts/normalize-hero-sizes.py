"""
Normaliza el tamano visual de las imagenes HERO del catalogo.

Problema: cada hero tiene aspect ratio distinto y porcentaje del frame
ocupado por el producto distinto, por lo que en la grid del /avisos se
ven unos productos enormes y otros chiquitos.

Estrategia:
  1. Lee cada HERO (-1.jpg) del directorio 2026/
  2. Detecta el bounding box del producto (todo lo que NO es blanco puro)
  3. Calcula el "mayor lado" del bounding box
  4. Crea un canvas cuadrado donde el mayor lado del producto ocupa el
     TARGET_FILL (78%) del canvas
  5. Centra el producto y rellena con blanco puro
  6. Sobreescribe el archivo

Skip:
  - mesa-rect-1.jpg, mesa-rect-2.jpg, mesa-rect-3.jpg (fotos lifestyle, no
    se pueden recortar sin perder el contexto)
  - paleta-redondo-1.jpg si no es render (verificar)

Solo procesa los heros (-1.jpg). Las imagenes de galeria mantienen
su composicion original.
"""
from pathlib import Path
from PIL import Image
import numpy as np

DIR = Path("C:/Users/User/Downloads/muffment-web/public/img/products/2026")
TARGET_SIZE = 1200       # canvas final cuadrado
TARGET_FILL = 0.78        # fraccion del canvas que ocupa el lado mayor del producto

SKIP = {
    "mesa-rect-1.jpg",   # foto real con contexto
    "mesa-rect-2.jpg",   # foto real
    "mesa-rect-3.jpg",   # foto real lifestyle
    "doble-lamina-portable-1.jpg",  # ya esta procesada con sombra
    "doble-lamina-portable-2.jpg",
    "doble-lamina-portable-3.jpg",
    "menu-swinger-1.jpg",
    "menu-swinger-2.jpg",
    "menu-swinger-3.jpg",
}

# Solo heros (sufijo -1.jpg) excepto los del skip
files = sorted([
    f for f in DIR.glob("*-1.jpg")
    if f.name not in SKIP
])

print(f"Archivos a procesar: {len(files)}")

for f in files:
    img = Image.open(f).convert("RGB")
    arr = np.array(img)

    # Mascara: pixel NO es blanco-cercano
    # blanco cercano = los 3 canales > 245
    is_white = np.all(arr > 245, axis=2)
    mask_product = ~is_white

    if not mask_product.any():
        print(f"  SKIP {f.name}: no se detecto producto")
        continue

    # Bounding box del producto
    ys, xs = np.where(mask_product)
    x0, x1 = xs.min(), xs.max()
    y0, y1 = ys.min(), ys.max()
    bbox_w = x1 - x0 + 1
    bbox_h = y1 - y0 + 1
    longest = max(bbox_w, bbox_h)

    # Recortar al bbox
    cropped = img.crop((x0, y0, x1 + 1, y1 + 1))

    # Calcular nuevo tamano: el lado mas largo del producto debe ser TARGET_FILL * TARGET_SIZE
    target_long = int(TARGET_SIZE * TARGET_FILL)
    scale = target_long / longest
    new_w = int(bbox_w * scale)
    new_h = int(bbox_h * scale)
    resized = cropped.resize((new_w, new_h), Image.LANCZOS)

    # Canvas blanco TARGET_SIZE x TARGET_SIZE
    canvas = Image.new("RGB", (TARGET_SIZE, TARGET_SIZE), (255, 255, 255))
    paste_x = (TARGET_SIZE - new_w) // 2
    paste_y = (TARGET_SIZE - new_h) // 2
    canvas.paste(resized, (paste_x, paste_y))

    canvas.save(f, "JPEG", quality=88, optimize=True)
    print(f"  ok {f.name}: bbox {bbox_w}x{bbox_h} -> {new_w}x{new_h} en canvas {TARGET_SIZE}x{TARGET_SIZE}")

print("\nDone.")
