// Clientes oficiales MUFFMENT — extraídos del PDF
// G:/Mi unidad/MUFFMENT/CLIENTES MUFF.pdf (versión 2025-04-23).
// "Marcas que confían en MUFFMENT" — Medellín, Bogotá, Cali, Cartagena, Santa Marta.

export type Client = {
  slug: string;
  name: string;
  /** Sector/tipo de negocio (café, beauty, hotel...). */
  type?: string;
  /** Producto MUFFMENT que adquirió (Hablador de piso plegable, etc). */
  productType?: string;
  city?: string;
};

/** Ciudades donde MUFFMENT ya tiene clientes. */
export const CLIENT_CITIES = [
  "Medellín",
  "Bogotá",
  "Cali",
  "Cartagena",
  "Santa Marta",
] as const;

export const CLIENTS: Client[] = [
  {
    slug: "mikaela",
    name: "MIKAELA",
    productType: "Hablador de piso plegable",
  },
  {
    slug: "reposteria-ely",
    name: "Repostería Ely",
    type: "Repostería",
    productType: "Hablador de piso plegable",
  },
  {
    slug: "hotel-23",
    name: "Hotel 23",
    type: "Hotel",
    productType: "Aviso de piso Bent",
  },
  {
    slug: "coffee-fer",
    name: "Coffee Fer",
    type: "Café",
    productType: "Hablador de pared",
  },
  {
    slug: "somos",
    name: "SOMOS",
    productType: "Hablador de piso plegable",
  },
  {
    slug: "ereo-belleza",
    name: "Ereo Belleza",
    type: "Beauty",
    productType: "Hablador de piso plegable",
  },
  {
    slug: "the-royal-shoeshine",
    name: "The Royal Shoeshine",
    type: "Lustrabotas",
    productType: "Hablador de piso plegable",
  },
  {
    slug: "antipoda",
    name: "Antípoda",
    type: "Restaurante",
    productType: "Hablador de piso plegable",
  },
  {
    slug: "calante",
    name: "Calante",
    type: "Restaurante",
    productType: "Habladores de piso y de mesa",
  },
  {
    slug: "don-martin-cafe",
    name: "Don Martín Café",
    type: "Café",
    productType: "Hablador de piso Paleta",
  },
  {
    slug: "claq-popup",
    name: "Claq Popup",
    type: "Pop-up store",
    productType: "Hablador de piso Ovalado",
  },
  {
    slug: "dina-y-flo",
    name: "Dina y Flo",
    productType: "Hablador de piso plegable",
  },
  {
    slug: "turmeque-heladeria",
    name: "Turmequé Heladería",
    type: "Heladería",
    productType: "Hablador de piso Ovalado",
  },
  {
    slug: "lu-jewelry",
    name: "LU Jewelry",
    type: "Joyería",
    productType: "Hablador de piso plegable",
  },
];
