"""Debug: trial different threshold + morphology combinations on page 8."""
import cv2
import numpy as np
from pathlib import Path

PAGE = "C:/Users/User/Downloads/carta-color-8.png"
OUT = Path("C:/Users/User/Downloads/muffment-web/scripts/chip-debug")
OUT.mkdir(parents=True, exist_ok=True)

img = cv2.imread(PAGE)
print(f"Page shape: {img.shape}")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Try different combinations
configs = [
    ("raw-180", lambda g: cv2.threshold(g, 180, 255, cv2.THRESH_BINARY_INV)[1]),
    ("raw-200", lambda g: cv2.threshold(g, 200, 255, cv2.THRESH_BINARY_INV)[1]),
    ("raw-220", lambda g: cv2.threshold(g, 220, 255, cv2.THRESH_BINARY_INV)[1]),
    ("otsu", lambda g: cv2.threshold(g, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]),
]

for name, fn in configs:
    th = fn(gray)
    cv2.imwrite(str(OUT / f"th-{name}.png"), cv2.resize(th, (th.shape[1]//3, th.shape[0]//3)))

    # Try contours WITHOUT morphology
    contours, _ = cv2.findContours(th, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    print(f"\n{name}: {len(contours)} contornos external")
    big = sorted([c for c in contours if cv2.contourArea(c) > 100_000], key=cv2.contourArea, reverse=True)[:15]
    print(f"  Top {len(big)} con área > 100K:")
    for i, c in enumerate(big):
        x, y, w, h = cv2.boundingRect(c)
        a = cv2.contourArea(c)
        ratio = w / h if h else 0
        print(f"    {i}: bbox ({x},{y}) {w}x{h} area={a:.0f} ratio={ratio:.2f}")
    debug = img.copy()
    for i, c in enumerate(big):
        x, y, w, h = cv2.boundingRect(c)
        cv2.rectangle(debug, (x,y), (x+w, y+h), (0,255,0), 5)
        cv2.putText(debug, str(i), (x+20, y+80), cv2.FONT_HERSHEY_SIMPLEX, 2.0, (0,0,255), 5)
    cv2.imwrite(str(OUT / f"detect-{name}.png"), cv2.resize(debug, (debug.shape[1]//3, debug.shape[0]//3)))

print("\nDone")
