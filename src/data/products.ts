// MUFFMENT — Catálogo 2026 (extraído del PDF oficial)
// Precios actualizados al catálogo vigente.

export type ProductCategory = "piso" | "pared" | "mesa" | "accesorio";

export type Product = {
  slug: string;
  code: string; // código interno OneDrive (ej. 5401)
  name: string;
  shortName: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number; // COP
  priceLabel: string; // "$915K"
  priceEstimated?: boolean;
  totalSize: string;
  artSize: string;
  materials: string;
  paint: string;
  description: string;
  hero: string; // imagen principal (relativa a /public)
  gallery?: string[]; // imágenes adicionales (relativas a /public)
  has3D?: boolean;
  modelPath?: string; // ruta al .glb si existe
  notes?: string;
  isNew?: boolean; // novedad 2026
};

export const PRODUCTS: Product[] = [
  // ============ HABLADORES DE PISO ============
  {
    slug: "hablador-piso-ov",
    code: "5420",
    name: "Hablador de Piso OV",
    shortName: "Piso OV",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 915000,
    priceLabel: "$915K",
    totalSize: "100 cm × 57 cm",
    artSize: "85 cm × 56 cm",
    materials: "Acero galvanizado, acero inoxidable",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "El hablador grande oval que cuenta tu marca a metros. Para entradas, terrazas y vitrinas. Pintura electrostática para sol y lluvia.",
    hero: "/img/products/2026/ov-1.jpg",
    gallery: [
      "/img/products/2026/ov-2.jpg",
      "/img/products/2026/ov-3.jpg",
      "/img/products/2026/ov-4.jpg",
      "/img/products/2026/ov-5.jpg",
    ],
    has3D: true,
  },
  {
    slug: "hablador-piso-plegable",
    code: "5408",
    name: "Hablador de Piso Plegable",
    shortName: "Piso Plegable",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 780000,
    priceLabel: "$780K",
    totalSize: "96 cm × 70 cm",
    artSize: "80 cm × 60 cm",
    materials: "Acero galvanizado, acero inoxidable",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "Tipo A-frame, plegable para guardar fácil al cierre. El clásico de cafés y restaurantes que cambian menú a diario.",
    hero: "/img/products/2026/plegable-1.jpg",
    gallery: [
      "/img/products/2026/plegable-2.jpg",
      "/img/products/2026/plegable-3.jpg",
      "/img/products/2026/plegable-4.jpg",
      "/img/products/2026/plegable-5.jpg",
      "/img/products/2026/plegable-6.jpg",
      "/img/products/2026/plegable-7.jpg",
    ],
    has3D: true,
  },
  {
    slug: "hablador-piso-plegable-small",
    code: "5422",
    name: "Hablador de Piso Plegable small",
    shortName: "Piso Plegable small",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 620000,
    priceLabel: "$620K",
    totalSize: "74 cm × 60 cm × 40 cm",
    artSize: "46 cm × 46 cm",
    materials: "Acero galvanizado, acero inoxidable",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "La versión chica del A-frame plegable. Misma lógica de cambio rápido de mensaje, formato compacto para entradas y barras estrechas.",
    hero: "/img/products/2026/plegable-small-1.jpg",
    gallery: [
      "/img/products/2026/plegable-small-2.jpg",
      "/img/products/2026/plegable-small-3.jpg",
      "/img/products/2026/plegable-small-4.jpg",
      "/img/products/2026/plegable-small-5.jpg",
    ],
    isNew: true,
  },
  {
    slug: "hablador-piso-top-shelf",
    code: "5428",
    name: "Hablador de Piso TOP SHELF",
    shortName: "Piso TOP SHELF",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 725000,
    priceLabel: "$725K",
    totalSize: "62 cm × 46 cm × 50 cm",
    artSize: "45 cm × 45 cm",
    materials: "Acero galvanizado, ABS con fibra de vidrio",
    paint: "En polvo, electrostática para interior y exterior",
    description:
      "Estructura tipo estante con bandeja superior. Para mostrar producto y mensaje al mismo tiempo. La información va aparte.",
    hero: "/img/products/2026/top-shelf-1.jpg",
    gallery: [
      "/img/products/2026/top-shelf-2.jpg",
      "/img/products/2026/top-shelf-3.jpg",
      "/img/products/2026/top-shelf-4.jpg",
      "/img/products/2026/top-shelf-5.jpg",
      "/img/products/2026/top-shelf-6.jpg",
    ],
    isNew: true,
    notes: "La información que pones en el aviso es un producto aparte.",
  },
  {
    slug: "hablador-piso-bent",
    code: "5415",
    name: "Hablador de Piso BENT",
    shortName: "Piso BENT",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 830000,
    priceLabel: "$830K",
    totalSize: "98 cm × 67 cm × 70 cm",
    artSize: "65 cm × 62 cm",
    materials: "Acero galvanizado, ABS con fibra de vidrio",
    paint: "En polvo, electrostática para interior y exterior",
    description:
      "Forma curva con personalidad. La pieza grande para zonas premium: hoteles, showrooms, retail concept.",
    hero: "/img/products/2026/bent-1.jpg",
    gallery: [
      "/img/products/2026/bent-2.jpg",
      "/img/products/2026/bent-3.jpg",
      "/img/products/2026/bent-4.jpg",
      "/img/products/2026/bent-5.jpg",
      "/img/products/2026/bent-6.jpg",
      "/img/products/2026/bent-7.jpg",
    ],
    isNew: true,
    notes: "La información que pones en el aviso es un producto aparte.",
  },
  {
    slug: "hablador-piso-paleta-redondo",
    code: "5401-4",
    name: "Paleta Redondo",
    shortName: "Paleta Redondo",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 725000,
    priceLabel: "$725K",
    totalSize: "106 cm × Ø 40 cm",
    artSize: "Ø 40 cm",
    materials: "Acero galvanizado, acero inoxidable",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "Paleta circular sobre poste. Vibe vintage gas-station modernizado. Llama desde la cuadra siguiente.",
    hero: "/img/products/2026/paleta-redondo-1.jpg",
    gallery: [
      "/img/products/2026/paleta-redondo-2.jpg",
      "/img/products/2026/paleta-redondo-3.jpg",
    ],
    has3D: true,
  },
  {
    slug: "hablador-piso-p-ov",
    code: "5407-1",
    name: "Hablador de Piso P.OV",
    shortName: "Piso P.OV",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 725000,
    priceLabel: "$725K",
    totalSize: "116 cm × 40 cm",
    artSize: "45 cm × 30 cm",
    materials: "Acero galvanizado, acero inoxidable",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "Paleta oval sobre poste alto. Para señalizar entrada, parking, recepción o lo que sea.",
    hero: "/img/products/piso-p-ov.jpg",
  },
  {
    slug: "hablador-piso-p-rect",
    code: "5406",
    name: "Hablador de Piso P.RECT",
    shortName: "Piso P.RECT",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 725000,
    priceLabel: "$725K",
    totalSize: "116 cm × 40 cm",
    artSize: "45 cm × 30 cm",
    materials: "Acero galvanizado, acero inoxidable",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "Paleta rectangular sobre poste alto. Como el P.OV pero con esquinas para que tu copy respire mejor.",
    hero: "/img/products/piso-p-rect.jpg",
  },
  {
    slug: "hablador-piso-p-ov-chico",
    code: "5407-2",
    name: "Hablador de Piso P.OV chico",
    shortName: "Piso P.OV chico",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 100000,
    priceLabel: "$100K",
    totalSize: "45 cm × 15 cm",
    artSize: "43 cm × 15 cm",
    materials: "Acero galvanizado, acero inoxidable",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "El compacto perfecto para barras, vitrinas y mesas altas. Mismo lenguaje, formato pequeño.",
    hero: "/img/products/piso-p-ov-chico.jpg",
  },
  {
    slug: "aviso-piso-menu-swinger",
    code: "5413",
    name: "Aviso de Piso MENU SWINGER",
    shortName: "Piso MENU SWINGER",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 790000,
    priceLabel: "$790K",
    totalSize: "115 cm × 40 cm",
    artSize: "39 cm × 26 cm",
    materials: "Acero galvanizado, acrílico 3mm",
    paint: "En polvo, electrostática para interior y exterior",
    description:
      "Aviso de piso pivotante. Acrílico 3mm para que tu mensaje brille con la luz. Perfecto para entradas y zonas de espera.",
    hero: "/img/products/piso-menu-swinger.jpg",
    isNew: true,
  },

  // ============ HABLADORES DE PARED ============
  {
    slug: "hablador-pared-rect-grande",
    code: "5409",
    name: "Hablador de Pared RECT grande",
    shortName: "Pared RECT grande",
    category: "pared",
    categoryLabel: "Hablador de pared",
    price: 650000,
    priceLabel: "$650K",
    totalSize: "85 cm × 46 cm",
    artSize: "80 cm × 40 cm",
    materials: "Acero galvanizado, acero inoxidable",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "Aviso colgante de techo o pared. Funciona con letras magnéticas — cambias el menú sin imprimir nada nuevo.",
    hero: "/img/products/pared-rect-grande.jpg",
    notes: "Las letras magnéticas son un producto aparte.",
  },
  {
    slug: "hablador-pared-flag",
    code: "5426",
    name: "Aviso de Pared FLAG",
    shortName: "Pared FLAG",
    category: "pared",
    categoryLabel: "Hablador de pared",
    price: 515000,
    priceLabel: "$515K",
    totalSize: "55 cm × 50 cm",
    artSize: "46 cm × 46 cm",
    materials: "Acero galvanizado, acero inoxidable, nailon",
    paint: "En polvo, electrostática para interior y exterior",
    description:
      "Bandera de pared con tensor en nailon. Cuelga perpendicular a la fachada y se ve desde ambas direcciones de la calle.",
    hero: "/img/products/2026/flag-1.jpg",
    gallery: [
      "/img/products/2026/flag-2.jpg",
      "/img/products/2026/flag-3.jpg",
      "/img/products/2026/flag-4.jpg",
      "/img/products/2026/flag-5.jpg",
    ],
    isNew: true,
  },
  {
    slug: "hablador-pared-luna-big",
    code: "5404-1",
    name: "Hablador de Pared LUNA BIG",
    shortName: "Pared LUNA BIG",
    category: "pared",
    categoryLabel: "Hablador de pared",
    price: 170000,
    priceLabel: "$170K",
    totalSize: "60 cm × 40 cm",
    artSize: "60 cm × 40 cm",
    materials: "Acero galvanizado, acero inoxidable",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "La media luna en versión grande. Más espacio, más impacto. Para fachadas que necesitan personalidad.",
    hero: "/img/products/pared-luna-big.jpg",
    isNew: true,
  },
  {
    slug: "hablador-pared-rect-chico",
    code: "5402-1",
    name: "Hablador de Pared RECT chico",
    shortName: "Pared RECT chico",
    category: "pared",
    categoryLabel: "Hablador de pared",
    price: 100000,
    priceLabel: "$100K",
    totalSize: "44 cm × 14.5 cm",
    artSize: "44 cm × 14.5 cm",
    materials: "Acero galvanizado, acero inoxidable",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "Aviso lateral de pared para pasillos y entradas. El espacio justo para tu nombre y un sub-texto.",
    hero: "/img/products/pared-rect-chico.jpg",
  },
  {
    slug: "hablador-pared-cuad",
    code: "5403",
    name: "Hablador de Pared CUAD",
    shortName: "Pared CUAD",
    category: "pared",
    categoryLabel: "Hablador de pared",
    price: 110000,
    priceLabel: "$110K",
    totalSize: "30 cm × 30 cm",
    artSize: "30 cm × 30 cm",
    materials: "Acero galvanizado, acero inoxidable",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "Cuadrado para logo + frase. Perfecto al lado de la puerta o sobre la barra.",
    hero: "/img/products/pared-cuad.jpg",
  },
  {
    slug: "hablador-pared-luna",
    code: "5404",
    name: "Hablador de Pared LUNA",
    shortName: "Pared LUNA",
    category: "pared",
    categoryLabel: "Hablador de pared",
    price: 90000,
    priceLabel: "$90K",
    totalSize: "30 cm × 20 cm",
    artSize: "30 cm × 20 cm",
    materials: "Acero galvanizado, acero inoxidable",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "Media luna lateral. La forma menos esperada — la más recordada.",
    hero: "/img/products/2026/luna-1.jpg",
  },

  // ============ HABLADORES DE MESA ============
  {
    slug: "hablador-mesa-rect",
    code: "5411",
    name: "Hablador de Mesa RECT",
    shortName: "Mesa RECT",
    category: "mesa",
    categoryLabel: "Hablador de mesa",
    price: 80000,
    priceLabel: "$80K",
    totalSize: "18 cm × 12 cm",
    artSize: "16 cm × 12 cm",
    materials: "Acero galvanizado, madera roble con acabados en cera de abeja, imanes neodimio",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "Para menús, números de mesa, promos. Base en madera roble con cera de abeja. Incluye 8 imanes neodimio.",
    hero: "/img/products/mesa-rect.jpg",
    notes: "Incluye 8 imanes neodimio.",
  },
  {
    slug: "hablador-mesa-clear",
    code: "5411-2",
    name: "Hablador de Mesa CLEAR",
    shortName: "Mesa CLEAR",
    category: "mesa",
    categoryLabel: "Hablador de mesa",
    price: 70000,
    priceLabel: "$70K",
    totalSize: "18 cm × 12 cm",
    artSize: "16 cm × 12 cm",
    materials: "Acrílico 2mm, madera roble con acabado en cera de abejas",
    paint: "—",
    description:
      "Versión transparente del hablador de mesa. Acrílico que deja respirar el menú y madera roble que aterriza la pieza.",
    hero: "/img/products/mesa-clear.jpg",
    isNew: true,
  },

  // ============ ACCESORIOS ============
  {
    slug: "letras-magneticas",
    code: "5412-1N",
    name: "Letras Magnéticas",
    shortName: "Letras Magnéticas",
    category: "accesorio",
    categoryLabel: "Accesorio",
    price: 760000,
    priceLabel: "$760K",
    totalSize: "25 mm de alto × 2 mm de espesor",
    artSize: "350 caracteres",
    materials: "Imán neodimio y acrílico",
    paint: "—",
    description:
      "Set de 350 caracteres (A-Z, 0-9, símbolos). Cambias el mensaje en segundos sin imprimir ni reimprimir nada.",
    hero: "/img/products/letras-magneticas.jpg",
    notes: "Compatible con habladores de pared metálicos.",
  },
];

export const CATEGORIES = [
  { id: "piso", label: "Habladores de piso", count: 10 },
  { id: "pared", label: "Habladores de pared", count: 6 },
  { id: "mesa", label: "Habladores de mesa", count: 2 },
  { id: "accesorio", label: "Accesorios", count: 1 },
] as const;

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ProductCategory) {
  return PRODUCTS.filter((p) => p.category === category);
}
