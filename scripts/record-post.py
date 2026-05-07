"""
Graba un video MP4 del /post para subir a Instagram Reels (9:16, 1080×1920).

Workflow:
  1. Abre Chromium headed (visible) a 1080×1920 viewport
  2. Navega a /post (debe estar corriendo localhost:3000)
  3. Espera 1.5s para que animaciones empiecen
  4. Graba 10 segundos a 30fps
  5. Convierte a MP4 con ffmpeg y guarda en /post-output/

Output: muffment-web/post-output/muffment-reel-9-16.mp4
"""
import subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT_DIR = Path("C:/Users/User/Downloads/muffment-web/post-output")
OUT_DIR.mkdir(exist_ok=True)
FINAL = OUT_DIR / "muffment-reel-9-16.mp4"

URL = "http://localhost:3000/post"
DURATION_SEC = 10

print(f"Recording {DURATION_SEC}s of {URL}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 1080, "height": 1920},
        record_video_dir=str(OUT_DIR),
        record_video_size={"width": 1080, "height": 1920},
        device_scale_factor=2,
    )
    page = context.new_page()

    # Inject CSS to esconder el preview-only badge "REEL 9:16 (1080x1920)"
    page.goto(URL, wait_until="networkidle")
    page.add_style_tag(content="""
      .post-frame > .pointer-events-none.absolute.right-2.top-2 {
        display: none !important;
      }
      body { background: black !important; padding: 0 !important; margin: 0 !important; }
      body > div { padding: 0 !important; }
    """)
    print("  page loaded, waiting for animations...")
    page.wait_for_timeout(1500)

    print(f"  recording {DURATION_SEC}s...")
    page.wait_for_timeout(DURATION_SEC * 1000)

    page.close()
    context.close()
    browser.close()

# Find the .webm file Playwright created
webms = list(OUT_DIR.glob("*.webm"))
if not webms:
    print("ERROR: no se generó video")
    exit(1)
webm = sorted(webms, key=lambda p: p.stat().st_mtime)[-1]
print(f"  raw video: {webm.name} ({webm.stat().st_size / 1024:.0f} KB)")

# Convertir a MP4 H.264 (formato Instagram-friendly)
print("  converting to MP4 (H.264)...")
cmd = [
    "ffmpeg", "-y",
    "-i", str(webm),
    "-vf", "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black,fps=30",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "20",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-an",
    str(FINAL),
]
result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
if result.returncode != 0:
    print("FFMPEG ERROR:", result.stderr[-500:])
    exit(1)

# Limpiar webm raw
webm.unlink()
print(f"\nDone: {FINAL}")
print(f"Tamaño: {FINAL.stat().st_size / 1024 / 1024:.2f} MB")
