// Clientes destacados con avisos MUFFMENT instalados.
// (Extraído de OneDrive/3.GRAFICO/PROYECTOS CLIENTES/ + IG @muffment)

export type Client = {
  slug: string;
  name: string;
  type?: string; // café, beauty, restaurante, etc.
  city?: string;
};

export const CLIENTS: Client[] = [
  { slug: "retorno", name: "RETORNO", type: "Coffee shop" },
  { slug: "planaduno", name: "PLANADUNO", type: "Café de especialidad" },
  { slug: "helado-suave", name: "Helado Suave", type: "Heladería" },
  { slug: "markit", name: "markit", type: "Boutique" },
  { slug: "manuela-t-beauty", name: "Manuela T Beauty", type: "Beauty & Hair" },
  { slug: "new-religion", name: "new religion", type: "Streetwear" },
  { slug: "herencia", name: "Herencia", type: "Boutique" },
  { slug: "torre", name: "Torre", type: "Comercio" },
  { slug: "competrafico", name: "Competráfico", type: "Servicios" },
  { slug: "calante", name: "Calante", type: "Restaurante" },
  { slug: "casa-eterna", name: "Casa Eterna", type: "Estudio" },
  { slug: "diego-chef-burguer", name: "Diego Chef Burguer", type: "Restaurante" },
  { slug: "gadejo", name: "Gadejo", type: "Café" },
  { slug: "liceo-frances", name: "Liceo Francés", type: "Educación" },
  { slug: "oculab", name: "Oculab", type: "Óptica" },
  { slug: "umami", name: "Umami", type: "Restaurante" },
];
