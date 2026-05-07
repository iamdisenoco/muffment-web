"""
Genera flag.png desde la silueta SVG/PNG completa, colorizando de negro
a amarillo MUFFMENT.

Source: C:/Users/User/Downloads/_siluetas/SILUETA_PARED_FLAG.png (silueta negra)
Output: muffment-web/public/img/products/2026/cutouts/flag.png
"""
from pathlib import Path
import numpy as np
from PIL import Image

SRC = Path("C:/Users/User/Downloads/_siluetas/SILUETA_PARED_FLAG.png")
OUT = Path("C:/Users/User/Downloads/muffment-web/public/img/products/2026/cutouts/flag.png")

# Color amarillo del flag real (sampleado de flag-1.jpg)
YELLOW_RGB = (244, 196, 33)
GREY_RGB = (140, 140, 145)  # para el clip metalico (zonas grises de la silueta)

img = Image.open(SRC).convert("RGBA")
arr = np.array(img)
print(f"Loaded: {arr.shape}")

# Mask: pixels negros/oscuros = el aviso. Pixels claros = fondo.
gray = arr[:, :, :3].mean(axis=2)
fg_mask = gray < 80  # pixels oscuros = foreground del aviso
bg_mask = ~fg_mask

# Reemplazar pixels foreground por amarillo
arr[fg_mask] = [*YELLOW_RGB, 255]
# Pixels background -> alpha 0 (transparente)
arr[bg_mask, 3] = 0

# Auto-crop al bounding box
mask_2d = fg_mask.astype(np.uint8) * 255
ys, xs = np.where(mask_2d > 0)
if len(xs) > 0:
    x0, x1 = xs.min(), xs.max()
    y0, y1 = ys.min(), ys.max()
    pad = 30
    x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
    x1, y1 = min(arr.shape[1], x1 + pad), min(arr.shape[0], y1 + pad)
    arr = arr[y0:y1, x0:x1]
    print(f"Cropped to: {arr.shape}")

result = Image.fromarray(arr, "RGBA")
# Resize max 1200
result.thumbnail((1200, 1200), Image.LANCZOS)
result.save(OUT, "PNG", optimize=True)
print(f"Saved: {OUT.name} ({OUT.stat().st_size / 1024:.1f} KB)")
