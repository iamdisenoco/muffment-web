/**
 * Carta de color ZMK Diseño SAS — la que usa MUFFMENT para sus avisos.
 *
 * 90 colores físicos (23 interior + 67 exterior) + 14 BicapaMate
 * (no incluidos en la carta física, son versiones MATE de otros).
 *
 * Los hex son APROXIMADOS — extraídos visualmente del PDF oficial,
 * pueden tener leve diferencia con la lámina física. El nombre y los
 * acabados sí están tal como en la carta.
 */

export type Finish =
  | "interior"
  | "brillante"
  | "semi-brillante"
  | "mate"
  | "semi-mate"
  | "texturizado"
  | "microtexturizado"
  | "destellos"
  | "micro-destellos";

export const FINISH_INFO: Record<
  Finish,
  { label: string; symbol: string; description: string }
> = {
  interior: { label: "Interior", symbol: "i", description: "Solo apto para interior" },
  brillante: { label: "Brillante", symbol: "circle", description: "Acabado totalmente brillante" },
  "semi-brillante": { label: "Semi-Brillante", symbol: "halfCircle", description: "Mezcla de brillante y mate" },
  mate: { label: "Mate", symbol: "square", description: "Sin brillo, plano" },
  "semi-mate": { label: "Semi-Mate", symbol: "halfSquare", description: "Suavemente mate" },
  texturizado: { label: "Texturizado", symbol: "crossSquare", description: "Textura visible al tacto" },
  microtexturizado: { label: "Microtexturizado", symbol: "dotSquare", description: "Textura sutil, casi imperceptible" },
  destellos: { label: "Con Destellos", symbol: "star", description: "Partículas que reflejan luz" },
  "micro-destellos": { label: "Con Micro Destellos", symbol: "microStar", description: "Destellos finos, brillo sutil" },
};

export type ColorFamily =
  | "blancos"
  | "beiges"
  | "tierras"
  | "dorados"
  | "amarillos"
  | "rojos"
  | "rosados"
  | "azules"
  | "verdes"
  | "grises"
  | "negros";

export const FAMILY_INFO: Record<
  ColorFamily,
  { label: string; description: string }
> = {
  blancos: { label: "Blancos", description: "Cremas y tonos claros" },
  beiges: { label: "Beiges", description: "Neutros cálidos" },
  tierras: { label: "Tierras", description: "Marrones y cobrizos" },
  dorados: { label: "Dorados", description: "Metálicos y bronces" },
  amarillos: { label: "Amarillos & Naranjas", description: "Tonos cálidos vibrantes" },
  rojos: { label: "Rojos", description: "Del granate al cereza" },
  rosados: { label: "Rosados & Morados", description: "Cálidos suaves a vino tinto" },
  azules: { label: "Azules & Turquesas", description: "Del cielo al índigo profundo" },
  verdes: { label: "Verdes", description: "Pistacho a militar" },
  grises: { label: "Grises", description: "Tonos neutros fríos" },
  negros: { label: "Negros", description: "Acabados profundos" },
};

export type Color = {
  id: string;
  name: string;
  family: ColorFamily;
  hex: string;
  finishes: Finish[];
  bicapaMate?: boolean; // true si también existe en versión Bicapa Mate
};

export const COLORS: Color[] = [
  // ========== BLANCOS ==========
  { id: "blanco-brillante", name: "Blanco Brillante", family: "blancos", hex: "#f7f4ec", finishes: ["brillante"] },
  { id: "blanco-mate", name: "Blanco Mate", family: "blancos", hex: "#f1ebd9", finishes: ["mate"] },
  { id: "blanco-vitral", name: "Blanco Vitral", family: "blancos", hex: "#ede6cf", finishes: ["brillante"] },
  { id: "blanco-niebla-mtx", name: "Blanco Niebla MTX", family: "blancos", hex: "#e6dec4", finishes: ["microtexturizado"] },
  { id: "blanco-nacar", name: "Blanco Nacar", family: "blancos", hex: "#cfc6ad", finishes: ["semi-brillante", "destellos"] },
  { id: "blanco-ice", name: "Blanco Ice", family: "blancos", hex: "#e9e2cd", finishes: ["semi-mate"] },
  { id: "blanco-grisaceo", name: "Blanco Grisáceo", family: "blancos", hex: "#ddd6c2", finishes: ["semi-brillante"] },

  // ========== BEIGES ==========
  { id: "beige-vintage", name: "Beige Vintage", family: "beiges", hex: "#b1a386", finishes: ["semi-brillante", "destellos"], bicapaMate: true },
  { id: "macadamia-mtx", name: "Macadamia MTX", family: "beiges", hex: "#a89a7d", finishes: ["microtexturizado"] },
  { id: "almendra-txt", name: "Almendra TXT", family: "beiges", hex: "#e7d8b8", finishes: ["interior", "texturizado"] },
  { id: "almendra-liso", name: "Almendra Liso", family: "beiges", hex: "#e2d3a8", finishes: ["interior", "brillante"], bicapaMate: true },
  { id: "olympia", name: "Olympia", family: "beiges", hex: "#6c6650", finishes: ["semi-mate"] },
  { id: "taupe", name: "Taupe", family: "beiges", hex: "#6f6952", finishes: ["mate"] },
  { id: "capuchino", name: "Capuchino", family: "beiges", hex: "#5b5341", finishes: ["semi-brillante"], bicapaMate: true },

  // ========== TIERRAS ==========
  { id: "golden-rose", name: "Golden Rose", family: "tierras", hex: "#ad7548", finishes: ["brillante"] },
  { id: "coralino", name: "Coralino", family: "tierras", hex: "#a55a2c", finishes: ["semi-brillante"], bicapaMate: true },
  { id: "oxido", name: "Óxido", family: "tierras", hex: "#91532a", finishes: ["microtexturizado"] },
  { id: "classic-cooper", name: "Classic Cooper", family: "tierras", hex: "#985836", finishes: ["brillante", "destellos"] },
  { id: "terracota", name: "Terracota", family: "tierras", hex: "#7d3a25", finishes: ["microtexturizado"] },
  { id: "cafe-finish", name: "Café Finish", family: "tierras", hex: "#20140e", finishes: ["mate"] },
  { id: "cedro", name: "Cedro", family: "tierras", hex: "#4f2e1c", finishes: ["microtexturizado"] },
  { id: "cedro-liso", name: "Cedro Liso", family: "tierras", hex: "#2e1a10", finishes: ["mate"] },
  { id: "rust-mtx", name: "Rust MTX", family: "tierras", hex: "#2e190f", finishes: ["microtexturizado", "mate"] },
  { id: "pink-shadow-zink", name: "Pink Shadow Zink", family: "tierras", hex: "#b58264", finishes: ["semi-brillante", "destellos"], bicapaMate: true },
  { id: "palo-e-rosa", name: "Palo e' Rosa", family: "tierras", hex: "#c79478", finishes: ["microtexturizado", "destellos"] },

  // ========== DORADOS ==========
  { id: "dorado-cobre", name: "Dorado Cobre", family: "dorados", hex: "#6e5520", finishes: ["brillante", "destellos"] },
  { id: "bronce-eco", name: "Bronce Eco", family: "dorados", hex: "#826822", finishes: ["brillante"] },
  { id: "arena-dorada", name: "Arena Dorada", family: "dorados", hex: "#6a5821", finishes: ["microtexturizado", "destellos"] },
  { id: "solar-glow", name: "Solar Glow", family: "dorados", hex: "#7f6a1f", finishes: ["brillante", "destellos"] },
  { id: "dorado-tornaza", name: "Dorado Tornaza Brasil", family: "dorados", hex: "#79661d", finishes: ["brillante", "destellos"] },
  { id: "dorado-diana-mtx", name: "Dorado Diana MTX", family: "dorados", hex: "#665318", finishes: ["microtexturizado", "micro-destellos"] },
  { id: "dorado-oxidado", name: "Dorado Oxidado", family: "dorados", hex: "#5e4f1b", finishes: ["destellos"] },
  { id: "oro-used", name: "Oro Used", family: "dorados", hex: "#a48b30", finishes: ["destellos"] },
  { id: "dorado-estano", name: "Dorado Estaño", family: "dorados", hex: "#3a3120", finishes: ["interior", "mate"] },

  // ========== AMARILLOS & NARANJAS ==========
  { id: "amarillo-canario", name: "Amarillo Canario", family: "amarillos", hex: "#f3c722", finishes: ["brillante"], bicapaMate: true },
  { id: "amarillo-fr", name: "Amarillo FR", family: "amarillos", hex: "#f3c322", finishes: ["brillante"], bicapaMate: true },
  { id: "amarillo-electrico-mtx", name: "Amarillo Eléctrico MTX", family: "amarillos", hex: "#dba31d", finishes: ["microtexturizado"] },
  { id: "mostaza", name: "Mostaza", family: "amarillos", hex: "#d97b22", finishes: ["brillante"] },
  { id: "mandoria-mtx", name: "Mandoria MTX", family: "amarillos", hex: "#cdc7a3", finishes: ["interior", "texturizado"] },
  { id: "naranja-corteza", name: "Naranja Corteza", family: "amarillos", hex: "#d56825", finishes: ["brillante", "destellos"] },
  { id: "tulum-zink", name: "Tulum Zink", family: "amarillos", hex: "#c75428", finishes: ["semi-mate"], bicapaMate: true },

  // ========== ROJOS ==========
  { id: "rojo-india", name: "Rojo India", family: "rojos", hex: "#b32a26", finishes: ["interior", "microtexturizado"] },
  { id: "granate", name: "Granate", family: "rojos", hex: "#962b27", finishes: ["brillante"] },
  { id: "marruecos", name: "Marruecos", family: "rojos", hex: "#6f1e1d", finishes: ["interior", "microtexturizado"] },
  { id: "rojo-happy", name: "Rojo Happy", family: "rojos", hex: "#c51d1c", finishes: ["brillante"] },
  { id: "rojo-manhattan", name: "Rojo Manhattan", family: "rojos", hex: "#4d2225", finishes: ["semi-brillante"] },
  { id: "rojo-manhattan-mtx", name: "Rojo Manhattan MTX", family: "rojos", hex: "#3d1a1d", finishes: ["microtexturizado"] },
  { id: "vino-tinto", name: "Vino Tinto", family: "rojos", hex: "#631518", finishes: ["interior", "brillante"] },
  { id: "burdeos", name: "Burdeos", family: "rojos", hex: "#6b1c2c", finishes: ["brillante"] },

  // ========== ROSADOS & MORADOS ==========
  { id: "rosado-bubble", name: "Rosado Bubble", family: "rosados", hex: "#f7c7c7", finishes: ["interior", "brillante"], bicapaMate: true },
  { id: "barbie-core", name: "Barbie Core", family: "rosados", hex: "#d12b66", finishes: ["interior", "brillante"], bicapaMate: true },
  { id: "lila", name: "Lila", family: "rosados", hex: "#997bb4", finishes: ["semi-brillante"], bicapaMate: true },

  // ========== AZULES & TURQUESAS ==========
  { id: "turquesa", name: "Turquesa", family: "azules", hex: "#2c8b88", finishes: ["brillante"], bicapaMate: true },
  { id: "celeste", name: "Celeste", family: "azules", hex: "#2779cd", finishes: ["brillante"], bicapaMate: true },
  { id: "pacifico", name: "Pacífico", family: "azules", hex: "#1e3563", finishes: ["interior", "mate"] },
  { id: "cobalto-mtx", name: "Cobalto MTX", family: "azules", hex: "#1c2855", finishes: ["interior", "microtexturizado"] },
  { id: "petroleo", name: "Petroleo", family: "azules", hex: "#11203e", finishes: ["mate"] },
  { id: "bali", name: "Bali", family: "azules", hex: "#1c3286", finishes: ["microtexturizado"] },
  { id: "azul-indigo-mtx", name: "Azul Índigo MTX", family: "azules", hex: "#11163f", finishes: ["microtexturizado", "micro-destellos"] },
  { id: "azul-indigo-intenso", name: "Azul Índigo Intenso Liso", family: "azules", hex: "#0c1131", finishes: ["interior", "destellos"] },

  // ========== VERDES ==========
  { id: "pistacho-txt", name: "Pistacho TXT", family: "verdes", hex: "#97a82c", finishes: ["texturizado", "brillante"] },
  { id: "verde-tahiti", name: "Verde Tahiti", family: "verdes", hex: "#889a2b", finishes: ["brillante"] },
  { id: "verde-oliva", name: "Verde Oliva", family: "verdes", hex: "#6a702c", finishes: ["brillante"], bicapaMate: true },
  { id: "vetiver", name: "Vetiver", family: "verdes", hex: "#837a51", finishes: ["semi-brillante"] },
  { id: "verde-cactus-mtx", name: "Verde Cactus MTX", family: "verdes", hex: "#4f5840", finishes: ["microtexturizado"] },
  { id: "verde-atlantis", name: "Verde Atlantis", family: "verdes", hex: "#29361c", finishes: ["mate", "destellos"] },
  { id: "jade", name: "Jade", family: "verdes", hex: "#1f4528", finishes: ["brillante"] },
  { id: "verde-militar", name: "Verde Militar", family: "verdes", hex: "#28321e", finishes: ["mate"] },
  { id: "verde-ficus-mtx", name: "Verde Ficus MTX", family: "verdes", hex: "#1d2918", finishes: ["microtexturizado"] },

  // ========== GRISES ==========
  { id: "gris-satin", name: "Gris Satín", family: "grises", hex: "#7f8275", finishes: ["mate"] },
  { id: "nordico", name: "Nórdico", family: "grises", hex: "#898879", finishes: ["microtexturizado"] },
  { id: "gris-ocaso", name: "Gris Ocaso", family: "grises", hex: "#2d3a36", finishes: ["brillante"] },
  { id: "gris-plata", name: "Gris Plata", family: "grises", hex: "#87897e", finishes: ["interior", "microtexturizado", "destellos"] },
  { id: "gris-invierno-mtx", name: "Gris Invierno MTX", family: "grises", hex: "#adb0a3", finishes: ["microtexturizado"] },
  { id: "dark-silver", name: "Dark Silver", family: "grises", hex: "#4d473e", finishes: ["mate", "destellos"] },
  { id: "metalizado", name: "Metalizado", family: "grises", hex: "#939086", finishes: ["destellos"] },
  { id: "antique-premium", name: "Antique Premium", family: "grises", hex: "#4a3c1d", finishes: ["microtexturizado", "destellos"] },
  { id: "highland-txt", name: "Highland TXT", family: "grises", hex: "#97978f", finishes: ["microtexturizado"] },
  { id: "gris-nopal-mtx", name: "Gris Nopal MTX", family: "grises", hex: "#322a1f", finishes: ["microtexturizado"] },
  { id: "pavonado-eco", name: "Pavonado Eco", family: "grises", hex: "#685a44", finishes: ["brillante"] },
  { id: "helado", name: "Helado", family: "grises", hex: "#aeb1a8", finishes: ["brillante"] },
  { id: "gris-navado", name: "Gris Navado", family: "grises", hex: "#2c2e2f", finishes: ["destellos"] },

  // ========== NEGROS ==========
  { id: "negro-onix", name: "Negro Onix", family: "negros", hex: "#131216", finishes: ["interior", "brillante", "semi-brillante"] },
  { id: "negro-rustik", name: "Negro Rustik", family: "negros", hex: "#181818", finishes: ["microtexturizado"] },
  { id: "titanio", name: "Titanio", family: "negros", hex: "#1a1a1a", finishes: ["semi-mate"] },
  { id: "negro-eclipse", name: "Negro Eclipse", family: "negros", hex: "#0c0c0c", finishes: ["mate"] },
  { id: "midnight-silver", name: "Midnight Silver", family: "negros", hex: "#131316", finishes: ["brillante", "micro-destellos"] },
  { id: "negro-media-noche", name: "Negro Media Noche", family: "negros", hex: "#0a0a0d", finishes: ["microtexturizado"] },
];

export const FAMILY_ORDER: ColorFamily[] = [
  "blancos",
  "beiges",
  "tierras",
  "dorados",
  "amarillos",
  "rojos",
  "rosados",
  "azules",
  "verdes",
  "grises",
  "negros",
];
