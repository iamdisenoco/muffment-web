"""
Detecta el área TOTAL de chips por página (con CLOSE fuerte) y la DIVIDE
según el grid conocido (rows × cols por página). Calcula bbox de cada chip.

Usa el grid hardcoded en GRID_LAYOUT (mapping de página → rows×cols).
"""
import cv2
import numpy as np
import json
from pathlib import Path

PAGES_DIR = Path("C:/Users/User/Downloads")
OUT_JSON = Path("C:/Users/User/Downloads/muffment-web/scripts/chip-bboxes.json")
DEBUG_DIR = Path("C:/Users/User/Downloads/muffment-web/scripts/chip-debug")
DEBUG_DIR.mkdir(parents=True, exist_ok=True)

# Layout de cada página: (rows, cols, num_chips, missing[(r,c),...])
# missing = celdas vacías en el grid.
GRID_LAYOUT = {
    3:  (3, 2, 6,  []),                  # Update 2024
    4:  (4, 2, 7,  [(3, 1)]),            # Whites
    5:  (4, 2, 7,  [(3, 1)]),            # Beiges
    6:  (4, 2, 8,  []),                  # Tierras
    7:  (5, 2, 9,  [(4, 0)]),            # Dorados (10 chips? — vamos con 9)
    8:  (5, 2, 9,  [(4, 1)]),            # Yellows/Reds
    9:  (4, 2, 7,  [(1, 0)]),            # Rosados
    10: (4, 2, 8,  []),                  # Azules
    11: (4, 2, 8,  []),                  # Verdes
    12: (4, 2, 7,  [(3, 1)]),            # Grises
    13: (3, 2, 6,  []),                  # Mixed
    14: (3, 2, 6,  []),                  # Negros
    15: (4, 2, 6,  [(2, 0), (2, 1)]),    # Bicapa Mate
    16: (4, 2, 8,  []),                  # Bicapa Mate
}

result = {}

for page_num in range(3, 17):
    page_path = PAGES_DIR / f"carta-color-{page_num}.png"
    if not page_path.exists():
        continue
    if page_num not in GRID_LAYOUT:
        continue

    rows_n, cols_n, _expected, missing = GRID_LAYOUT[page_num]
    img = cv2.imread(str(page_path))
    H, W = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # CLOSE muy fuerte para mergear todos los chips en un solo blob.
    close_k = cv2.getStructuringElement(cv2.MORPH_RECT, (151, 151))
    closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, close_k)

    # OPEN para limpiar elementos sueltos del bottom legend.
    open_k = cv2.getStructuringElement(cv2.MORPH_RECT, (51, 51))
    cleaned = cv2.morphologyEx(closed, cv2.MORPH_OPEN, open_k)

    cv2.imwrite(str(DEBUG_DIR / f"page-{page_num:02d}-cleaned.png"),
                cv2.resize(cleaned, (cleaned.shape[1]//3, cleaned.shape[0]//3)))

    # Find the LARGEST connected component (= todos los chips juntos).
    n, labels, stats, _ = cv2.connectedComponentsWithStats(cleaned, connectivity=8)
    if n < 2:
        print(f"page-{page_num}: NO blob detectado")
        continue
    # Skip background (label 0), pick largest component.
    areas = [(i, stats[i, cv2.CC_STAT_AREA]) for i in range(1, n)]
    areas.sort(key=lambda x: -x[1])
    largest = areas[0][0]
    bx = int(stats[largest, cv2.CC_STAT_LEFT])
    by = int(stats[largest, cv2.CC_STAT_TOP])
    bw = int(stats[largest, cv2.CC_STAT_WIDTH])
    bh = int(stats[largest, cv2.CC_STAT_HEIGHT])

    # Dividir bbox en rows × cols.
    cell_w = bw // cols_n
    cell_h = bh // rows_n
    print(f"page-{page_num}: bbox total ({bx},{by}) {bw}x{bh}, cell ~{cell_w}x{cell_h}")

    rows = []
    for r in range(rows_n):
        row = []
        for c in range(cols_n):
            if (r, c) in missing:
                continue
            x = bx + c * cell_w
            y = by + r * cell_h
            row.append({"x": x, "y": y, "w": cell_w, "h": cell_h})
            print(f"  r{r}c{c}: ({x},{y}) {cell_w}x{cell_h}")
        rows.append(row)

    result[str(page_num)] = {"bbox": {"x": bx, "y": by, "w": bw, "h": bh}, "rows": rows}

    debug_img = img.copy()
    cv2.rectangle(debug_img, (bx, by), (bx + bw, by + bh), (0, 255, 0), 10)
    for r, row in enumerate(rows):
        for c, chip in enumerate(row):
            x, y, cw, ch = chip["x"], chip["y"], chip["w"], chip["h"]
            cv2.rectangle(debug_img, (x, y), (x + cw, y + ch), (255, 0, 0), 6)
            cv2.putText(debug_img, f"{r},{c}", (x + 20, y + 80),
                        cv2.FONT_HERSHEY_SIMPLEX, 2.0, (0, 0, 255), 5)
    cv2.imwrite(str(DEBUG_DIR / f"page-{page_num:02d}-detect.png"),
                cv2.resize(debug_img, (debug_img.shape[1] // 3, debug_img.shape[0] // 3)))

with open(OUT_JSON, "w") as f:
    json.dump(result, f, indent=2)

print(f"\nGuardado: {OUT_JSON}")
