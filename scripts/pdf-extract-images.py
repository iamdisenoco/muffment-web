"""
Extrae cada imagen embebida del PDF original de la carta ZMK.
Cada chip de color es un objeto de imagen separado en el PDF — esto evita
TODOS los problemas de cropping con coordenadas rasterizadas.

Salida: scripts/pdf-images/page-N-img-M.png con metadata de posición.
"""
import fitz  # PyMuPDF
import json
import os
from pathlib import Path

PDF = "C:/Users/User/Downloads/carta-colores.pdf"
OUT = Path("C:/Users/User/Downloads/muffment-web/scripts/pdf-images")
OUT.mkdir(parents=True, exist_ok=True)

doc = fitz.open(PDF)
print(f"PDF tiene {len(doc)} páginas")

manifest = []
for page_num, page in enumerate(doc):
    images = page.get_images(full=True)
    print(f"\nPágina {page_num + 1}: {len(images)} imágenes embebidas")
    for img_idx, img in enumerate(images):
        xref = img[0]
        # Obtener la imagen como bytes
        try:
            base_img = doc.extract_image(xref)
            ext = base_img["ext"]
            img_bytes = base_img["image"]
            w = base_img["width"]
            h = base_img["height"]
        except Exception as e:
            print(f"  ERR img {img_idx} (xref {xref}): {e}")
            continue

        # Buscar la posición de esta imagen en la página
        # (puede haber múltiples ocurrencias)
        rects = [r for r in page.get_image_rects(xref) if r]
        rect = rects[0] if rects else None
        bbox = (rect.x0, rect.y0, rect.x1, rect.y1) if rect else None

        out_name = f"page-{page_num + 1:02d}-img-{img_idx:02d}.{ext}"
        out_path = OUT / out_name
        with open(out_path, "wb") as f:
            f.write(img_bytes)

        print(f"  OK {out_name}: {w}x{h}px, bbox={bbox}")
        manifest.append({
            "file": out_name,
            "page": page_num + 1,
            "index": img_idx,
            "width": w,
            "height": h,
            "ext": ext,
            "bbox": bbox,
            "xref": xref,
        })

# Guardar manifest para mapear chips a IDs después
with open(OUT / "manifest.json", "w") as f:
    json.dump(manifest, f, indent=2)

print(f"\nTotal: {len(manifest)} imágenes extraídas → {OUT}")
print(f"Manifest: {OUT / 'manifest.json'}")
