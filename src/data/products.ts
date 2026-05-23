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
  video?: string; // video del producto (mp4 relativo a /public, autoplay loop muted)
  has3D?: boolean;
  modelPath?: string; // ruta al .glb si existe
  notes?: string;
  isNew?: boolean; // novedad 2026
  tags?: string[]; // categorías transversales: "menu", "lifestyle", etc.
  shippingSize: "grande" | "mediano" | "pequeno"; // tamaño para cálculo de envío
};

export const PRODUCTS: Product[] = [
  // ============ HABLADORES DE PISO ============
  {
    slug: "hablador-piso-ov",
    code: "5420",
    name: "Hablador de Piso Ovalado",
    shortName: "Piso Ovalado",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 915000,
    priceLabel: "$915K",
    totalSize: "100 cm × 57 cm",
    artSize: "85 cm × 56 cm",
    materials: "Acero con tratamiento de metalizado que garantiza 0 oxidación, acero inoxidable",
    paint: "Pintada con pintura electrostática",
    description:
      "Permite desarmarse por medio de una llave, ideal para estar transportando y que ocupe menos espacio.",
    hero: "/img/products/2026/ov-1.jpg",
    has3D: true,    shippingSize: "grande",
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
    materials: "Acero con tratamiento de metalizado que garantiza 0 oxidación, acero inoxidable",
    paint: "Pintada con pintura electrostática",
    description:
      "Permite plegarse, ideal si necesitas guardarlo todos los días o moverlo de un lugar a otro.",
    hero: "/img/products/2026/plegable-1-cutout.png",
    gallery: [
      "/img/products/2026/plegable-2-cutout.png",
      "/img/products/2026/plegable-3-cutout.png",
      "/img/products/2026/plegable-4-cutout.png",
      "/img/products/2026/plegable-5-cutout.png",
      "/img/products/2026/plegable-6-cutout.png",
      "/img/products/2026/plegable-7-cutout.png",
    ],
    has3D: true,    shippingSize: "grande",
  },
  {
    slug: "hablador-piso-plegable-small",
    code: "5422",
    name: "Hablador de Piso Plegable Pequeño",
    shortName: "Piso Plegable Pequeño",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 620000,
    priceLabel: "$620K",
    totalSize: "74 cm × 60 cm × 40 cm",
    artSize: "46 cm × 46 cm",
    materials: "Acero con tratamiento de metalizado que garantiza 0 oxidación, acero inoxidable",
    paint: "Pintada con pintura electrostática",
    description:
      "Permite plegarse, ideal si necesitas guardarlo todos los días o moverlo de un lugar a otro. Versión compacta para entradas y barras estrechas.",
    hero: "/img/products/2026/plegable-small-1.jpg",
    gallery: [
      "/img/products/2026/plegable-small-2.jpg",
      "/img/products/2026/plegable-small-3.jpg",
      "/img/products/2026/plegable-small-4.jpg",
      "/img/products/2026/plegable-small-5.jpg",
    ],
    isNew: true,    shippingSize: "mediano",
  },
  {
    slug: "hablador-piso-top-shelf",
    code: "5428",
    name: "Hablador de Piso Top Shelf",
    shortName: "Piso Top Shelf",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 725000,
    priceLabel: "$725K",
    totalSize: "62 cm × 46 cm × 50 cm",
    artSize: "45 cm × 45 cm",
    materials: "Acero con tratamiento de metalizado que garantiza 0 oxidación, ABS con fibra de vidrio",
    paint: "Pintada con pintura electrostática",
    description:
      "Cuenta con una bandeja en la parte de arriba para poner objetos decorativos y volver el aviso único.",
    hero: "/img/products/2026/top-shelf-1.jpg",
    gallery: [
      "/img/products/2026/top-shelf-2.jpg",
      "/img/products/2026/top-shelf-3.jpg",
      "/img/products/2026/top-shelf-4.jpg",
      "/img/products/2026/top-shelf-5.jpg",
      "/img/products/2026/top-shelf-6.jpg",
    ],
    isNew: true,
    notes: "La información que pones en el aviso es un producto aparte.",    shippingSize: "grande",
  },
  {
    slug: "hablador-piso-bent",
    code: "5415",
    name: "Hablador de Piso Bent",
    shortName: "Piso Bent",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 830000,
    priceLabel: "$830K",
    totalSize: "98 cm × 67 cm × 70 cm",
    artSize: "65 cm × 62 cm",
    materials: "Acero con tratamiento de metalizado que garantiza 0 oxidación, tapones impresión 3D",
    paint: "Pintada con pintura electrostática",
    description:
      "El más indicado para lugares donde hay vientos fuertes — su estructura fija y robusta genera gran estabilidad. Tapones en impresión 3D para evitar rayar el piso.",
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
    notes: "La información que pones en el aviso es un producto aparte.",    shippingSize: "grande",
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
    materials: "Acero con tratamiento de metalizado que garantiza 0 oxidación, base en acero macizo",
    paint: "Pintada con pintura electrostática",
    description:
      "Aviso paleta de una sola pieza, con una base en acero macizo que garantiza gran estabilidad.",
    hero: "/img/products/2026/paleta-redondo-1.jpg",
    gallery: [
      "/img/products/2026/paleta-redondo-2.jpg",
      "/img/products/2026/paleta-redondo-3.jpg",
    ],
    has3D: true,    shippingSize: "grande",
  },
  {
    slug: "hablador-piso-p-ov",
    code: "5407-1",
    name: "Paleta Ovalado",
    shortName: "Paleta Ovalado",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 725000,
    priceLabel: "$725K",
    totalSize: "116 cm × 40 cm",
    artSize: "45 cm × 30 cm",
    materials: "Acero con tratamiento de metalizado que garantiza 0 oxidación, base en acero macizo",
    paint: "Pintada con pintura electrostática",
    description:
      "Aviso paleta de una sola pieza, con una base en acero macizo que garantiza gran estabilidad. Versión oval.",
    hero: "/img/products/2026/p-ov-1.jpg",
    gallery: [
      "/img/products/2026/p-ov-2.jpg",
      "/img/products/2026/p-ov-3.jpg",
    ],    shippingSize: "grande",
  },
  {
    slug: "hablador-piso-p-rect",
    code: "5406",
    name: "Paleta Rectangular",
    shortName: "Paleta Rectangular",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 725000,
    priceLabel: "$725K",
    totalSize: "116 cm × 40 cm",
    artSize: "45 cm × 30 cm",
    materials: "Acero con tratamiento de metalizado que garantiza 0 oxidación, base en acero macizo",
    paint: "Pintada con pintura electrostática",
    description:
      "Aviso paleta de una sola pieza, con una base en acero macizo que garantiza gran estabilidad. Versión rectangular.",
    hero: "/img/products/2026/p-rect-1.jpg",
    gallery: [
      "/img/products/2026/p-rect-2.jpg",
      "/img/products/2026/p-rect-3.jpg",
    ],    shippingSize: "grande",
  },
  {
    slug: "aviso-piso-menu-swinger",
    code: "5413",
    name: "Aviso de Piso Menu Swinger",
    shortName: "Piso Menu Swinger",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 790000,
    priceLabel: "$790K",
    totalSize: "115 cm × 40 cm",
    artSize: "39 cm × 26 cm",
    materials: "Acero con tratamiento de metalizado que garantiza 0 oxidación, acrílico 3mm",
    paint: "Pintada con pintura electrostática",
    description:
      "Aviso recibidor, ideal para poner en la entrada y destacar tu menú o un plato del día. Caja magnética en acrílico para cambiar la info fácilmente. La parte superior gira para usarla en modo horizontal o vertical.",
    hero: "/img/products/2026/menu-swinger-1.jpg",
    gallery: [
      "/img/products/2026/menu-swinger-2.jpg",
      "/img/products/2026/menu-swinger-3.jpg",
    ],
    isNew: true,
    tags: ["menu"],    shippingSize: "grande",
  },
  {
    slug: "aviso-piso-doble-lamina-portable",
    code: "5423",
    name: "Doble Lámina Portable",
    shortName: "Doble Lámina Portable",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 1097000,
    priceLabel: "$1.097K",
    totalSize: "170 cm × 80 cm",
    artSize: "Dos paneles 60 × 40 cm",
    materials: "Acero con tratamiento de metalizado que garantiza 0 oxidación, láminas en aluminio, tapones impresión 3D",
    paint: "Pintada con pintura electrostática",
    description:
      "Permite desarmarse sin herramienta, lo que lo hace ideal para transportar o para eventos. Tapones en impresión 3D en la base para no rayar el piso.",
    hero: "/img/products/2026/doble-lamina-portable-1.jpg",
    gallery: [
      "/img/products/2026/doble-lamina-portable-2.jpg",
      "/img/products/2026/doble-lamina-portable-3.jpg",
    ],
    isNew: true,    shippingSize: "grande",
  },

  // ============ HABLADORES DE PARED ============
  {
    slug: "hablador-pared-rect-grande",
    code: "5409",
    name: "Hablador de Pared Rectangular Grande",
    shortName: "Pared Rectangular Grande",
    category: "pared",
    categoryLabel: "Hablador de pared",
    price: 650000,
    priceLabel: "$650K",
    totalSize: "85 cm × 46 cm",
    artSize: "80 cm × 40 cm",
    materials: "Acero con tratamiento de metalizado que garantiza 0 oxidación, acero inoxidable",
    paint: "Pintada con pintura electrostática",
    description:
      "Ideal para poner tu menú sea en interior o exterior. Funciona con letras magnéticas — cambias el mensaje sin imprimir nada nuevo.",
    hero: "/img/products/2026/pared-rect-grande-1.jpg",
    gallery: [
      "/img/products/2026/pared-rect-grande-2.jpg",
      "/img/products/2026/pared-rect-grande-3.jpg",
    ],
    notes: "Las letras magnéticas son un producto aparte.",
    tags: ["menu"],    shippingSize: "mediano",
  },
  {
    slug: "hablador-pared-flag",
    code: "5426",
    name: "Aviso de Pared Flag",
    shortName: "Pared Flag",
    category: "pared",
    categoryLabel: "Hablador de pared",
    price: 515000,
    priceLabel: "$515K",
    totalSize: "55 cm × 50 cm",
    artSize: "46 cm × 46 cm",
    materials: "Acero con tratamiento de metalizado que garantiza 0 oxidación, acero inoxidable, nailon",
    paint: "Pintada con pintura electrostática",
    description:
      "Ideal para poner afuera o adentro tu marca con tu logo o alguna frase llamativa. Bandera perpendicular a la fachada, visible desde ambas direcciones de la calle.",
    hero: "/img/products/2026/flag-1-v2.jpg",
    gallery: [
      "/img/products/2026/flag-2.jpg",
      "/img/products/2026/flag-3.jpg",
      "/img/products/2026/flag-4.jpg",
      "/img/products/2026/flag-5.jpg",
    ],
    isNew: true,    shippingSize: "pequeno",
  },
  {
    slug: "hablador-pared-flag-ov",
    code: "5426-1",
    name: "Aviso de Pared Flag Ovalado",
    shortName: "Pared Flag Ovalado",
    category: "pared",
    categoryLabel: "Hablador de pared",
    price: 515000,
    priceLabel: "$515K",
    totalSize: "65 cm × 45 cm",
    artSize: "50 cm × 35 cm",
    materials: "Acero con tratamiento de metalizado que garantiza 0 oxidación, acero inoxidable, herrajes impresión 3D",
    paint: "Pintada con pintura electrostática",
    description:
      "Ideal para poner afuera o adentro tu marca con tu logo o alguna frase llamativa. Versión oval del Flag, silueta más suave.",
    hero: "/img/products/2026/flag-ov-1.jpg",
    gallery: [
      "/img/products/2026/flag-ov-2.jpg",
    ],
    isNew: true,    shippingSize: "pequeno",
  },
  {
    slug: "hablador-pared-luna-big",
    code: "5404-1",
    name: "Hablador de Pared Luna Grande",
    shortName: "Pared Luna Grande",
    category: "pared",
    categoryLabel: "Hablador de pared",
    price: 170000,
    priceLabel: "$170K",
    totalSize: "60 cm × 40 cm",
    artSize: "60 cm × 40 cm",
    materials: "Acero con tratamiento de metalizado que garantiza 0 oxidación, acero inoxidable",
    paint: "Pintada con pintura electrostática",
    description:
      "Ideal para poner afuera o adentro tu marca con tu logo o alguna frase llamativa. Forma media luna en versión grande, más espacio, más impacto.",
    hero: "/img/products/2026/pared-luna-big-1.jpg",
    gallery: [
      "/img/products/2026/pared-luna-big-2.jpg",
    ],
    isNew: true,    shippingSize: "mediano",
  },
  {
    slug: "aviso-pared-rectangular",
    code: "5402",
    name: "Aviso de Pared Rectangular",
    shortName: "Pared Rectangular",
    category: "pared",
    categoryLabel: "Hablador de pared",
    price: 100000,
    priceLabel: "$100K",
    priceEstimated: true,
    totalSize: "44 cm × 14.5 cm",
    artSize: "44 cm × 14.5 cm",
    materials: "Acero con tratamiento de metalizado que garantiza 0 oxidación, acero inoxidable",
    paint: "Pintada con pintura electrostática",
    description:
      "Ideal para poner afuera o adentro tu marca con tu logo o alguna frase llamativa. Una sola pieza con anclaje lateral oculto.",
    hero: "/img/products/2026/pared-rectangular-1.jpg",
    gallery: [
      "/img/products/2026/pared-rectangular-2.jpg",
    ],    shippingSize: "pequeno",
  },
  {
    slug: "hablador-pared-cuad",
    code: "5403",
    name: "Hablador de Pared Cuadrado",
    shortName: "Pared Cuadrado",
    category: "pared",
    categoryLabel: "Hablador de pared",
    price: 110000,
    priceLabel: "$110K",
    totalSize: "30 cm × 30 cm",
    artSize: "30 cm × 30 cm",
    materials: "Acero con tratamiento de metalizado que garantiza 0 oxidación, acero inoxidable",
    paint: "Pintada con pintura electrostática",
    description:
      "Ideal para poner afuera o adentro tu marca con tu logo o alguna frase llamativa. Formato cuadrado, perfecto al lado de la puerta o sobre la barra.",
    hero: "/img/products/2026/pared-cuad-1.jpg",
    gallery: [
      "/img/products/2026/pared-cuad-2.jpg",
    ],    shippingSize: "pequeno",
  },
  {
    slug: "hablador-pared-luna",
    code: "5404",
    name: "Hablador de Pared Luna",
    shortName: "Pared Luna",
    category: "pared",
    categoryLabel: "Hablador de pared",
    price: 90000,
    priceLabel: "$90K",
    totalSize: "30 cm × 20 cm",
    artSize: "30 cm × 20 cm",
    materials: "Acero con tratamiento de metalizado que garantiza 0 oxidación, acero inoxidable",
    paint: "Pintada con pintura electrostática",
    description:
      "Ideal para poner afuera o adentro tu marca con tu logo o alguna frase llamativa. Forma media luna lateral, la más recordada.",
    hero: "/img/products/2026/luna-1.jpg",    shippingSize: "pequeno",
  },

  // ============ HABLADORES DE MESA ============
  {
    slug: "hablador-mesa-rect",
    code: "5411",
    name: "Hablador de Mesa Rectangular",
    shortName: "Mesa Rectangular",
    category: "mesa",
    categoryLabel: "Hablador de mesa",
    price: 80000,
    priceLabel: "$80K",
    totalSize: "18 cm × 12 cm",
    artSize: "16 cm × 12 cm",
    materials: "Acero con tratamiento de metalizado que garantiza 0 oxidación, madera roble con acabado en cera de abejas, imanes neodimio",
    paint: "Pintada con pintura electrostática",
    description:
      "Hablador de mesa para poner tu menú o destacar algún plato o evento. Incluye imanes neodimio para cambiar la información rápido y fácil.",
    hero: "/img/products/2026/mesa-rect-1.jpg",
    gallery: [
      "/img/products/2026/mesa-rect-2.jpg",
      "/img/products/2026/mesa-rect-3.jpg",
    ],
    video: "/img/products/2026/mesa-rect-video.mp4",
    notes: "Incluye 8 imanes neodimio.",
    tags: ["menu"],    shippingSize: "pequeno",
  },
  {
    slug: "hablador-mesa-clear",
    code: "5411-2",
    name: "Hablador de Mesa Clear",
    shortName: "Mesa Clear",
    category: "mesa",
    categoryLabel: "Hablador de mesa",
    price: 70000,
    priceLabel: "$70K",
    totalSize: "18 cm × 12 cm",
    artSize: "16 cm × 12 cm",
    materials: "Acrílico 3mm, madera roble con acabado en cera de abejas",
    paint: "—",
    description:
      "Hablador de mesa para poner tu menú o destacar algún plato o evento. Dos acrílicos transparentes para cambiar la info rápido y fácil.",
    hero: "/img/products/2026/mesa-clear-1.jpg",
    isNew: true,
    tags: ["menu"],    shippingSize: "pequeno",
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
    notes: "Compatible con habladores de pared metálicos.",    shippingSize: "pequeno",
  },
];

export const CATEGORIES = [
  { id: "piso", label: "Habladores de piso", count: 10 },
  { id: "pared", label: "Habladores de pared", count: 7 },
  { id: "mesa", label: "Habladores de mesa", count: 2 },
  { id: "accesorio", label: "Accesorios", count: 1 },
] as const;

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ProductCategory) {
  return PRODUCTS.filter((p) => p.category === category);
}
