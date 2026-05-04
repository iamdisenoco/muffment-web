/**
 * Genera swatches PNG (340x340 con alpha circular) para cada chip ZMK,
 * con visuales que VARIAN segun los finishes de cada color:
 *   - brillante      -> radial sheen fuerte + highlight especular
 *   - semi-brillante -> sheen moderado
 *   - mate           -> SIN sheen, solo grain plano
 *   - semi-mate      -> sheen muy sutil
 *   - texturizado    -> turbulence gruesa visible
 *   - microtexturizado -> turbulence fina
 *   - destellos      -> 6-8 sparkles dispersos
 *   - micro-destellos -> ~22 sparkles tiny
 *   - interior       -> sin efecto extra
 *
 * El COLOR es exacto (mediana de pixels del chip en el PDF).
 */

import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PDF_PAGES_DIR = "C:/Users/User/Downloads";
const OUT_DIR = path.join(ROOT, "public", "colors");
const BBOXES_PATH = path.join(__dirname, "chip-bboxes.json");
const COLORS_TS = path.join(ROOT, "src", "data", "colors.ts");

const COLOR_GRID = [
  ["mandoria-mtx",          3, 0, 0],
  ["amarillo-electrico-mtx",3, 0, 1],
  ["palo-e-rosa",           3, 1, 0],
  ["verde-cactus-mtx",      3, 1, 1],
  ["cedro-liso",            3, 2, 0],
  ["rojo-manhattan-mtx",    3, 2, 1],
  ["blanco-brillante",      4, 0, 0],
  ["blanco-mate",           4, 0, 1],
  ["blanco-vitral",         4, 1, 0],
  ["blanco-niebla-mtx",     4, 1, 1],
  ["blanco-nacar",          4, 2, 0],
  ["blanco-ice",            4, 2, 1],
  ["blanco-grisaceo",       4, 3, 0],
  ["beige-vintage",         5, 0, 0],
  ["macadamia-mtx",         5, 0, 1],
  ["almendra-txt",          5, 1, 0],
  ["almendra-liso",         5, 1, 1],
  ["olympia",               5, 2, 0],
  ["taupe",                 5, 2, 1],
  ["capuchino",             5, 3, 0],
  ["golden-rose",           6, 0, 0],
  ["coralino",              6, 0, 1],
  ["oxido",                 6, 1, 0],
  ["classic-cooper",        6, 1, 1],
  ["terracota",             6, 2, 0],
  ["cafe-finish",           6, 2, 1],
  ["cedro",                 6, 3, 0],
  ["rust-mtx",              6, 3, 1],
  ["dorado-cobre",          7, 0, 0],
  ["bronce-eco",            7, 0, 1],
  ["arena-dorada",          7, 1, 0],
  ["solar-glow",            7, 1, 1],
  ["dorado-tornaza",        7, 2, 0],
  ["dorado-diana-mtx",      7, 2, 1],
  ["dorado-oxidado",        7, 3, 0],
  ["oro-used",              7, 3, 1],
  ["dorado-estano",         7, 4, 1],
  ["amarillo-canario",      8, 0, 0],
  ["amarillo-fr",           8, 0, 1],
  ["mostaza",               8, 1, 0],
  ["naranja-corteza",       8, 1, 1],
  ["tulum-zink",            8, 2, 0],
  ["rojo-india",            8, 2, 1],
  ["granate",               8, 3, 0],
  ["marruecos",             8, 3, 1],
  ["rojo-happy",            8, 4, 0],
  ["rosado-bubble",         9, 0, 0],
  ["barbie-core",           9, 0, 1],
  ["pink-shadow-zink",      9, 1, 1],
  ["lila",                  9, 2, 0],
  ["rojo-manhattan",        9, 2, 1],
  ["vino-tinto",            9, 3, 0],
  ["burdeos",               9, 3, 1],
  ["turquesa",             10, 0, 0],
  ["celeste",              10, 0, 1],
  ["pacifico",             10, 1, 0],
  ["cobalto-mtx",          10, 1, 1],
  ["petroleo",             10, 2, 0],
  ["bali",                 10, 2, 1],
  ["azul-indigo-mtx",      10, 3, 0],
  ["azul-indigo-intenso",  10, 3, 1],
  ["pistacho-txt",         11, 0, 0],
  ["verde-oliva",          11, 0, 1],
  ["verde-tahiti",         11, 1, 0],
  ["vetiver",              11, 1, 1],
  ["verde-atlantis",       11, 2, 0],
  ["jade",                 11, 2, 1],
  ["verde-militar",        11, 3, 0],
  ["verde-ficus-mtx",      11, 3, 1],
  ["gris-satin",           12, 0, 0],
  ["nordico",              12, 0, 1],
  ["gris-ocaso",           12, 1, 0],
  ["gris-plata",           12, 1, 1],
  ["gris-invierno-mtx",    12, 2, 0],
  ["dark-silver",          12, 2, 1],
  ["metalizado",           12, 3, 0],
  ["antique-premium",      13, 0, 0],
  ["highland-txt",         13, 0, 1],
  ["gris-nopal-mtx",       13, 1, 0],
  ["pavonado-eco",         13, 1, 1],
  ["helado",               13, 2, 0],
  ["gris-navado",          13, 2, 1],
  ["negro-onix",           14, 0, 0],
  ["negro-rustik",         14, 0, 1],
  ["titanio",              14, 1, 0],
  ["negro-eclipse",        14, 1, 1],
  ["midnight-silver",      14, 2, 0],
  ["negro-media-noche",    14, 2, 1],
];

const FINAL_SIZE = 340;

// Parse src/data/colors.ts y construye un map id -> finishes[].
async function loadFinishes() {
  const src = await readFile(COLORS_TS, "utf8");
  const map = {};
  const re = /id:\s*"([^"]+)"[^}]*?finishes:\s*\[([^\]]*)\]/gs;
  let m;
  while ((m = re.exec(src)) !== null) {
    const id = m[1];
    const finishesStr = m[2];
    const fins = (finishesStr.match(/"([^"]+)"/g) || []).map((s) =>
      s.replace(/"/g, ""),
    );
    map[id] = fins;
  }
  return map;
}

function medianRGB(data, channels) {
  const hR = new Array(256).fill(0);
  const hG = new Array(256).fill(0);
  const hB = new Array(256).fill(0);
  const n = data.length / channels;
  for (let i = 0; i < data.length; i += channels) {
    hR[data[i]]++;
    hG[data[i + 1]]++;
    hB[data[i + 2]]++;
  }
  const half = n / 2;
  const med = (h) => {
    let cum = 0;
    for (let v = 0; v < 256; v++) {
      cum += h[v];
      if (cum >= half) return v;
    }
    return 255;
  };
  return { r: med(hR), g: med(hG), b: med(hB) };
}

function lum01(r, g, b) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

// Pseudo-random determinista a partir de seed + index.
function rand(seed, idx) {
  const x = Math.sin(seed * 1000 + idx * 137.5) * 10000;
  return x - Math.floor(x);
}

function buildSwatchSvg(hex, seed, finishes, isDark) {
  const has = (f) => finishes.includes(f);
  const layers = [];
  const defs = [];
  const S = FINAL_SIZE;
  const cx = S / 2;
  const cy = S / 2;
  const radius = S / 2 - 1;

  // === Texturas con visual MUY distinto cada una ===
  if (has("texturizado")) {
    // GRAIN CHUNKY tipo lija — turbulence con threshold para crear blobs
    // visibles. Combina dos turbulence layers (uno grueso, uno medio) y
    // le da bastante opacidad para que se vea sin dudas.
    defs.push(`
      <filter id="grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.10" numOctaves="3" seed="${seed}" result="t1"/>
        <feColorMatrix in="t1" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" result="grainCoarse"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="2" seed="${(seed + 47) % 1000}" result="t2"/>
        <feColorMatrix in="t2" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" result="grainMid"/>
        <feMerge>
          <feMergeNode in="grainCoarse"/>
          <feMergeNode in="grainMid"/>
        </feMerge>
      </filter>`);
  } else if (has("microtexturizado")) {
    // grain FINO casi invisible — la microtextura se simula con DOTS
    // dispersos (ver bloque de dots abajo)
    defs.push(`
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="3.5" numOctaves="2" seed="${seed}"/>
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.10 0"/>
      </filter>`);
  } else {
    // sin textura: grain casi invisible
    defs.push(`
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${seed}"/>
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.03 0"/>
      </filter>`);
  }

  // === Sheen segun gloss ===
  if (has("brillante")) {
    // Sheen fuerte tipo bola brillante 3D
    defs.push(`
      <radialGradient id="sheen" cx="32%" cy="26%" r="80%">
        <stop offset="0%"  stop-color="rgba(255,255,255,0.42)"/>
        <stop offset="35%" stop-color="rgba(255,255,255,0.05)"/>
        <stop offset="80%" stop-color="rgba(0,0,0,0)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.32)"/>
      </radialGradient>`);
  } else if (has("semi-brillante")) {
    defs.push(`
      <radialGradient id="sheen" cx="34%" cy="28%" r="85%">
        <stop offset="0%"  stop-color="rgba(255,255,255,0.22)"/>
        <stop offset="55%" stop-color="rgba(255,255,255,0)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.20)"/>
      </radialGradient>`);
  } else if (has("semi-mate")) {
    defs.push(`
      <radialGradient id="sheen" cx="34%" cy="28%" r="90%">
        <stop offset="0%"  stop-color="rgba(255,255,255,0.10)"/>
        <stop offset="55%" stop-color="rgba(255,255,255,0)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.18)"/>
      </radialGradient>`);
  } else {
    // mate: sin sheen — solo un MUY suave shadow al borde para sentir volumen
    defs.push(`
      <radialGradient id="sheen" cx="50%" cy="50%" r="52%">
        <stop offset="80%" stop-color="rgba(0,0,0,0)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.20)"/>
      </radialGradient>`);
  }

  // === ClipPath circular ===
  defs.push(`<clipPath id="clip"><circle cx="${cx}" cy="${cy}" r="${radius}"/></clipPath>`);

  // === Composición de layers ===
  layers.push(`<rect width="100%" height="100%" fill="${hex}"/>`);
  layers.push(`<rect width="100%" height="100%" filter="url(#grain)"/>`);
  layers.push(`<rect width="100%" height="100%" fill="url(#sheen)"/>`);

  // Specular highlight EXTRA para brillantes (un punto luminoso definido)
  if (has("brillante")) {
    layers.push(`<ellipse cx="${cx - S * 0.16}" cy="${cy - S * 0.20}" rx="${S * 0.18}" ry="${S * 0.10}" fill="rgba(255,255,255,0.45)" />`);
  }

  // === Microtexturizado dots — motas SUTILES (visibles pero no
  // demasiado marcadas). Tamaño y opacidad mas moderados. ===
  if (has("microtexturizado")) {
    const dotColor = isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.20)";
    const dotColorAlt = isDark ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.24)";
    const N_DOTS = 90;
    for (let i = 0; i < N_DOTS; i++) {
      const px = (rand(seed, 500 + i * 2) * 0.92 + 0.04) * S;
      const py = (rand(seed, 500 + i * 2 + 1) * 0.92 + 0.04) * S;
      const r = 1.4 + rand(seed, 700 + i) * 2.0;
      const fill = i % 2 === 0 ? dotColor : dotColorAlt;
      layers.push(`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r.toFixed(2)}" fill="${fill}"/>`);
    }
  }

  // === Destellos ===
  const sparkColor = isDark ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.78)";
  if (has("destellos")) {
    // 7 sparkles grandes dispersos
    for (let i = 0; i < 7; i++) {
      const px = (rand(seed, i * 2) * 0.78 + 0.11) * S;
      const py = (rand(seed, i * 2 + 1) * 0.78 + 0.11) * S;
      const r = 2.0 + rand(seed, 100 + i) * 1.6;
      layers.push(`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r.toFixed(2)}" fill="${sparkColor}"/>`);
    }
  }
  if (has("micro-destellos")) {
    // 24 sparkles tiny
    for (let i = 0; i < 24; i++) {
      const px = (rand(seed, 200 + i * 2) * 0.82 + 0.09) * S;
      const py = (rand(seed, 200 + i * 2 + 1) * 0.82 + 0.09) * S;
      const r = 0.7 + rand(seed, 300 + i) * 0.6;
      layers.push(`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r.toFixed(2)}" fill="${sparkColor}"/>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>${defs.join("")}</defs>
  <g clip-path="url(#clip)">${layers.join("")}</g>
</svg>`;
}

async function run() {
  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });
  const bboxes = JSON.parse(await readFile(BBOXES_PATH, "utf8"));
  const finishesMap = await loadFinishes();

  let ok = 0;
  for (const [id, page, row, col] of COLOR_GRID) {
    const pageData = bboxes[String(page)];
    const rowChips = pageData?.rows?.[row] || [];
    const chip = rowChips.length === 1 ? rowChips[0] : rowChips[col];
    if (!chip) {
      console.warn(`SKIP ${id}: no bbox`);
      continue;
    }

    // Sample del UPPER-MIDDLE del chip. La detection del bbox a veces es
    // mas alta que el chip real (extiende hacia bottom paper), entonces
    // sampleamos la parte superior donde sí está el chip.
    const sx = Math.round(chip.x + chip.w * 0.18);
    const sy = Math.round(chip.y + chip.h * 0.08);
    const sw = Math.round(chip.w * 0.65);
    const sh = Math.round(chip.h * 0.40);

    const pagePath = path.join(PDF_PAGES_DIR, `carta-color-${page}.png`);
    if (!existsSync(pagePath)) continue;

    try {
      const { data, info } = await sharp(pagePath)
        .extract({ left: sx, top: sy, width: sw, height: sh })
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      const { r, g, b } = medianRGB(data, info.channels);
      const hex = `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
      const isDark = lum01(r, g, b) < 0.55;
      const finishes = finishesMap[id] || [];
      const seed = Array.from(id).reduce((a, ch) => a + ch.charCodeAt(0), 0) % 1000;

      await sharp(Buffer.from(buildSwatchSvg(hex, seed, finishes, isDark)))
        .png({ quality: 95 })
        .toFile(path.join(OUT_DIR, `${id}.png`));

      ok++;
      console.log(`OK ${id} -> ${hex} [${finishes.join(",")}]`);
    } catch (err) {
      console.error(`ERR ${id}: ${err.message}`);
    }
  }
  console.log(`\nDone: ${ok}/${COLOR_GRID.length}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
