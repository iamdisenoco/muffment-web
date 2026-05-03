// MUFFMENT — Catálogo 2024 (extraído del PDF oficial + IG)
// Precios marcados con * son estimados; Jon ajusta después en este archivo.

export type ProductCategory = "piso" | "pared" | "mesa" | "accesorio";

export type Product = {
  slug: string;
  code: string; // código interno OneDrive (ej. 5401)
  name: string;
  shortName: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number; // COP
  priceLabel: string; // "$790K"
  priceEstimated?: boolean;
  totalSize: string;
  artSize: string;
  materials: string;
  paint: string;
  description: string;
  hero: string; // imagen principal (relativa a /public)
  has3D?: boolean;
  modelPath?: string; // ruta al .glb si existe
  notes?: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "hablador-piso-ov",
    code: "5402",
    name: "Hablador de Piso OV",
    shortName: "Piso OV",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 790000,
    priceLabel: "$790K",
    totalSize: "100 cm × 57 cm",
    artSize: "85 cm × 56 cm",
    materials: "Acero cold rolled, acero inoxidable",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "El hablador grande oval que cuenta tu marca a metros. Para entradas, terrazas y vitrinas. Pintura electrostática para sol y lluvia.",
    hero: "/img/products/piso-ov.jpg",
    has3D: true,
  },
  {
    slug: "hablador-piso-plegable",
    code: "5403",
    name: "Hablador de Piso Plegable",
    shortName: "Piso Plegable",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 670000,
    priceLabel: "$670K",
    totalSize: "96 cm × 70 cm",
    artSize: "80 cm × 60 cm",
    materials: "Acero cold rolled y acero inoxidable",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "Tipo A-frame, plegable para guardar fácil al cierre. El clásico de cafés y restaurantes que cambian menú a diario.",
    hero: "/img/products/piso-plegable.jpg",
    has3D: true,
  },
  {
    slug: "hablador-piso-paleta",
    code: "5408",
    name: "Hablador de Piso Paleta",
    shortName: "Piso Paleta",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 480000,
    priceLabel: "$480K",
    priceEstimated: true,
    totalSize: "106 cm × Ø 40 cm",
    artSize: "Ø 40 cm",
    materials: "Acero cold rolled y acero inoxidable",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "Paleta circular sobre poste. Vibe vintage gas-station modernizado. Llama desde la cuadra siguiente.",
    hero: "/img/products/piso-paleta.jpg",
    has3D: true,
  },
  {
    slug: "hablador-piso-p-ov",
    code: "5409",
    name: "Hablador de Piso P.OV",
    shortName: "Piso P.OV",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 510000,
    priceLabel: "$510K",
    priceEstimated: true,
    totalSize: "116 cm × 40 cm",
    artSize: "45 cm × 30 cm",
    materials: "Acero cold rolled, acero inoxidable",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "Paleta oval sobre poste alto. Para señalizar entrada, parking, recepción o lo que sea.",
    hero: "/img/products/piso-p-ov.jpg",
  },
  {
    slug: "hablador-piso-p-rect",
    code: "5410",
    name: "Hablador de Piso P.RECT",
    shortName: "Piso P.RECT",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 510000,
    priceLabel: "$510K",
    priceEstimated: true,
    totalSize: "116 cm × 40 cm",
    artSize: "45 cm × 30 cm",
    materials: "Acero cold rolled, acero inoxidable",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "Paleta rectangular sobre poste alto. Como el P.OV pero con esquinas para que tu copy respire mejor.",
    hero: "/img/products/piso-p-rect.jpg",
  },
  {
    slug: "hablador-piso-p-ov-chico",
    code: "5411",
    name: "Hablador de Piso P.OV chico",
    shortName: "Piso P.OV chico",
    category: "piso",
    categoryLabel: "Hablador de piso",
    price: 90000,
    priceLabel: "$90K",
    totalSize: "45 cm × 15 cm",
    artSize: "43 cm × 15 cm",
    materials: "Acero galvanizado, acero inoxidable",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "El compacto perfecto para barras, vitrinas y mesas altas. Mismo lenguaje, formato pequeño.",
    hero: "/img/products/piso-p-ov-chico.jpg",
  },
  {
    slug: "hablador-pared-rect-grande",
    code: "5404",
    name: "Hablador de Pared RECT grande",
    shortName: "Pared RECT grande",
    category: "pared",
    categoryLabel: "Hablador de pared",
    price: 560000,
    priceLabel: "$560K",
    totalSize: "85 cm × 46 cm",
    artSize: "80 cm × 40 cm",
    materials: "Acero cold rolled, acero inox",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "Aviso colgante de techo o pared. Funciona con letras magnéticas — cambias el menú sin imprimir nada nuevo.",
    hero: "/img/products/pared-rect-grande.jpg",
    notes: "Las letras magnéticas son un producto aparte.",
  },
  {
    slug: "hablador-pared-rect-chico",
    code: "5405",
    name: "Hablador de Pared RECT chico",
    shortName: "Pared RECT chico",
    category: "pared",
    categoryLabel: "Hablador de pared",
    price: 90000,
    priceLabel: "$90K",
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
    code: "5406",
    name: "Hablador de Pared CUAD",
    shortName: "Pared CUAD",
    category: "pared",
    categoryLabel: "Hablador de pared",
    price: 95000,
    priceLabel: "$95K",
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
    code: "5407",
    name: "Hablador de Pared LUNA",
    shortName: "Pared LUNA",
    category: "pared",
    categoryLabel: "Hablador de pared",
    price: 80000,
    priceLabel: "$80K",
    totalSize: "30 cm × 20 cm",
    artSize: "30 cm × 20 cm",
    materials: "Acero galvanizado, acero inoxidable",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "Media luna lateral. La forma menos esperada — la más recordada.",
    hero: "/img/products/pared-luna.jpg",
  },
  {
    slug: "hablador-mesa-rect",
    code: "5401",
    name: "Hablador de Mesa RECT",
    shortName: "Mesa RECT",
    category: "mesa",
    categoryLabel: "Hablador de mesa",
    price: 72000,
    priceLabel: "$72K",
    totalSize: "18 cm × 12 cm",
    artSize: "16 cm × 12 cm",
    materials: "Acero cold rolled, madera pino, imanes neodimio",
    paint: "En polvo, electrostática, para exterior e interior",
    description:
      "Para menús, números de mesa, promos. Base en madera pino. Incluye 8 imanes neodimio.",
    hero: "/img/products/mesa-rect.jpg",
    notes: "Incluye 8 imanes neodimio.",
  },
  {
    slug: "letras-magneticas",
    code: "MAG350",
    name: "Letras Magnéticas",
    shortName: "Letras Magnéticas",
    category: "accesorio",
    categoryLabel: "Accesorio",
    price: 650000,
    priceLabel: "$650K",
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
  { id: "piso", label: "Habladores de piso", count: 6 },
  { id: "pared", label: "Habladores de pared", count: 4 },
  { id: "mesa", label: "Habladores de mesa", count: 1 },
  { id: "accesorio", label: "Accesorios", count: 1 },
] as const;

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ProductCategory) {
  return PRODUCTS.filter((p) => p.category === category);
}
