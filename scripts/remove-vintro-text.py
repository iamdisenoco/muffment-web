"""
Quita VINTRO del aviso paleta redondo PINTANDO una elipse marron solida
sobre el chip del aviso. Detecta el chip con HoughCircles, y pinta el
interior con un gradient marron natural.

Esto SI funciona porque no depende de inpainting — directamente reemplaza
la zona del aviso.
"""
import cv2
import numpy as np
from pathlib import Path

SRC = Path("C:/Users/User/Downloads/muffment-web/public/img/products/paleta-redondo-1-detail.jpg")
OUT = SRC

img = cv2.imread(str(SRC))
H, W = img.shape[:2]

# Detectar el circulo del aviso con HoughCircles
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
gray_blur = cv2.medianBlur(gray, 9)
circles = cv2.HoughCircles(
    gray_blur, cv2.HOUGH_GRADIENT, dp=1, minDist=200,
    param1=50, param2=30,
    minRadius=int(min(H, W) * 0.15),
    maxRadius=int(min(H, W) * 0.45),
)

if circles is None:
    print("No circulo detectado, usando default centrado")
    cx, cy, r = W // 2, int(H * 0.45), int(min(H, W) * 0.30)
else:
    circles = np.round(circles[0]).astype(int)
    # Tomar el circulo MAS GRANDE (el aviso)
    biggest = max(circles, key=lambda c: c[2])
    cx, cy, r = biggest
    print(f"Circulo: ({cx}, {cy}) r={r}")

# Hacer mask circular del aviso (un poco mas pequeño que el detectado para no
# tocar el borde)
chip_mask = np.zeros((H, W), dtype=np.uint8)
cv2.circle(chip_mask, (int(cx), int(cy)), int(r * 0.95), 255, -1)

# Sample del color promedio del aviso, EXCLUYENDO los pixels muy oscuros (texto)
chip_pixels = img[chip_mask > 0]
chip_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
text_pixels = chip_gray[chip_mask > 0]
non_text = chip_pixels[text_pixels >= 60]
if len(non_text) > 100:
    avg_color = non_text.mean(axis=0)
else:
    avg_color = chip_pixels.mean(axis=0)
print(f"Avg chip color (BGR): {avg_color}")

# Crear capa con gradient radial sutil (para que el aviso no quede plano)
# - centro un poco mas claro
# - bordes un poco mas oscuros
# Esto imita la luz natural sobre la superficie del chip
overlay = img.copy()
yy, xx = np.ogrid[:H, :W]
dist_from_center = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / r
dist_from_center = np.clip(dist_from_center, 0, 1)
# Gradient: 0 (centro) → 1 (borde). Multiplicador de brillo: 1.08 → 0.85
brightness = 1.08 - dist_from_center * 0.23
brightness = brightness[..., None]  # broadcast a 3 canales

flat_chip = np.full_like(img, avg_color, dtype=np.float32)
gradient_chip = (flat_chip * brightness).astype(np.uint8)

# Aplicar sobre el chip area solamente — soft blend en los bordes
soft_mask = cv2.GaussianBlur(chip_mask, (15, 15), 0).astype(np.float32) / 255.0
soft_mask = soft_mask[..., None]

result = (gradient_chip * soft_mask + img * (1 - soft_mask)).astype(np.uint8)

cv2.imwrite(str(OUT), result, [cv2.IMWRITE_JPEG_QUALITY, 92])
print(f"Saved: {OUT.name}")
