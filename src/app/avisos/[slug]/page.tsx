import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailSection } from "@/components/ProductDetailSection";
import { ProductHeroGallery, type HeroSectionConfig } from "@/components/ProductHeroGallery";
import { PRODUCTS, getProduct } from "@/data/products";

/** Galerías hero estilo Musotoku — secciones full-bleed con layouts variados
 *  (single/split-2/triplet) y callouts opcionales tipo iOS update. */
const HERO_GALLERIES: Record<string, HeroSectionConfig[]> = {
  "hablador-piso-plegable": [
    /* 1 — Hero opener: Header naked + cards a la IZQUIERDA + módulo mini
       de carta de color a la DERECHA (Jon 2026-05-23). */
    {
      bg: "gradient-radial",
      layout: "single",
      headerNaked: true,
      showColorMandala: true,
      images: [{ src: "/img/products/2026/plegable-1-hero-v6.png", alt: "Vista frontal 3/4" }],
      callouts: [
        {
          fromX: 40, fromY: 30, toX: 22, toY: 22, side: "left",
          title: "Medidas",
          body: "Total: 96 cm × 70 cm · Arte: 80 cm × 60 cm.",
        },
        {
          fromX: 40, fromY: 78, toX: 22, toY: 75, side: "left",
          title: "Personalización",
          body: "Ver opciones para poner la info",
          href: "/avisos/hablador-piso-plegable/opciones",
        },
      ],
    },

    /* Reorden Jon 2026-05-23: anchors FIJOS por imagen (no se cambian),
       el ORDEN intercala multi-image entre las single-LEFT para evitar
       2 del mismo lado consecutivas.
       Anchors fijos: plegable-4/5/6 = LEFT, plegable-7 = RIGHT.
       Pattern: center / L / multi / L / multi / L / R */

    /* 2 — LEFT plegable-4 + card "Garantía" derecha */
    {
      bg: "blueprint",
      layout: "single",
      images: [{
        src: "/img/products/2026/plegable-4-hero-v4.png",
        alt: "Detalle vértice superior con lengüeta de cuelgue",
        position: "left center",
      }],
      callouts: [
        {
          fromX: 25, fromY: 50, toX: 78, toY: 50, side: "right",
          title: "Garantía",
          body: "3 años de garantía.",
        },
      ],
    },

    /* 3 — Split 2 fotos (separador entre LEFTs). Sin callouts: las cards
       solo van en secciones single (regla Jon 2026-05-23). */
    {
      bg: "silk-cream",
      layout: "split-2",
      images: [
        { src: "/img/products/2026/plegable-2-hero-v4.png", alt: "Vista frontal con lámina" },
        { src: "/img/products/2026/plegable-3-hero-v4.png", alt: "Vista trasera plegado" },
      ],
    },

    /* 4 — LEFT plegable-5 + card "Acabados" derecha */
    {
      bg: "gradient-vertical",
      layout: "single",
      images: [{
        src: "/img/products/2026/plegable-5-hero-v4.png",
        alt: "Close-up barra estabilizadora",
        position: "left center",
      }],
      callouts: [
        {
          fromX: 25, fromY: 50, toX: 78, toY: 50, side: "right",
          title: "Acabados",
          body: "+ de 90 colores disponibles.",
        },
      ],
    },

    /* 5 — Triplet (separador entre LEFTs). Sin callouts: las cards
       solo van en secciones single (regla Jon 2026-05-23). */
    {
      bg: "sparkles-cobalt",
      layout: "triplet",
      images: [
        { src: "/img/products/2026/plegable-1-hero-v6.png", alt: "Vista hero" },
        { src: "/img/products/2026/plegable-2-hero-v4.png", alt: "Vista frontal" },
        { src: "/img/products/2026/plegable-7-hero-v4.png", alt: "Vista perfil" },
      ],
    },

    /* 6 — LEFT plegable-6 + card "Duradero" derecha */
    {
      bg: "concrete-cream",
      layout: "single",
      images: [{
        src: "/img/products/2026/plegable-6-hero-v4.png",
        alt: "Close-up bisagra y base",
        position: "left center",
      }],
      callouts: [
        {
          fromX: 25, fromY: 50, toX: 78, toY: 50, side: "right",
          title: "Duradero",
          body: "Diseñado para durar.",
        },
      ],
    },

    /* 7 — RIGHT plegable-7 + card "Acabado" izquierda */
    {
      bg: "diagonal-stripes",
      layout: "single",
      images: [{
        src: "/img/products/2026/plegable-7-hero-v4.png",
        alt: "Vista detalle base",
        position: "right center",
      }],
      callouts: [
        {
          fromX: 75, fromY: 50, toX: 22, toY: 50, side: "left",
          title: "Acabado",
          body: "Pintura electrostática. 0 oxidación garantizada.",
        },
      ],
    },
  ],
};

/** Productos con selector de color habilitado.
 *  Mapping: slug del producto → prefix usado en /img/products/colors/{prefix}-{color-id}.jpg
 *  Excluidos: mesa-rect (foto lifestyle con video del cliente),
 *  mesa-clear (acrílico transparente sin color base), letras-magneticas
 *  (accesorio sin foto producto). */
const COLOR_PICKER_PRODUCTS: Record<string, string> = {
  "hablador-piso-ov": "ov",
  "hablador-piso-plegable": "plegable",
  "hablador-piso-plegable-small": "plegable-small",
  "hablador-piso-top-shelf": "top-shelf",
  "hablador-piso-bent": "bent",
  "hablador-piso-paleta-redondo": "paleta-redondo",
  "hablador-piso-p-ov": "p-ov",
  "hablador-piso-p-rect": "p-rect",
  "aviso-piso-menu-swinger": "menu-swinger",
  "aviso-piso-doble-lamina-portable": "doble-lamina-portable",
  "hablador-pared-rect-grande": "pared-rect-grande",
  "hablador-pared-flag": "flag",
  "hablador-pared-flag-ov": "flag-ov",
  "hablador-pared-luna-big": "pared-luna-big",
  "aviso-pared-rectangular": "pared-rectangular",
  "hablador-pared-cuad": "pared-cuad",
  "hablador-pared-luna": "luna",
  // Mesa Rect 5411 — Jon pidió que también tenga picker. Usa el prefix
  // "mesa-rect" (si no hay fotos por color generadas, el componente
  // sigue mostrando el hero default — pero el picker visualmente sí
  // aparece y el chip de color seleccionado va al carrito).
  "hablador-mesa-rect": "mesa-rect",
};
type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
  ).slice(0, 4);

  // Rediseño en proceso (2026-05-23, Jon): la galería hero Musotoku-style
  // es lo PRIMERO que ve el usuario. Después viene el resto.
  const heroGallery = HERO_GALLERIES[product.slug];

  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Header />
      <main className="relative bg-white">
        {/* ═════ GALERÍA HERO PRIMERO (7 ángulos full-bleed) ═════ */}
        {heroGallery ? (
          <ProductHeroGallery sections={heroGallery} productName={product.name} />
        ) : (
          /* Fallback para productos sin galería: cabecera cobalt clásica */
          <div className="pt-32">
            <div
              aria-hidden
              data-header-theme="dark"
              className="pointer-events-none absolute inset-x-0 top-0 z-0 h-20 bg-cobalt md:h-24"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-20 z-0 h-40 md:top-24 md:h-[160px]"
              style={{
                background:
                  "linear-gradient(to bottom, rgb(50,54,183) 0%, rgba(50,54,183,0.15) 60%, rgba(255,255,255,0) 100%)",
              }}
            />
            <div className="relative z-10 mx-auto max-w-[1600px] px-6 pb-12 md:px-12">
              <nav
                className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-cream/75"
                style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
              >
                <Link href="/avisos" className="transition-opacity hover:text-cream">
                  ← Catálogo
                </Link>
                <span aria-hidden className="inline-block h-px w-6 bg-cream/35" />
                <Link
                  href={`/avisos?cat=${product.category}`}
                  className="transition-opacity hover:text-cream"
                >
                  {product.categoryLabel}
                </Link>
                <span aria-hidden className="inline-block h-px w-6 bg-cream/35" />
                <span className="text-cream/55">N°{product.code}</span>
              </nav>
            </div>
          </div>
        )}

        {/* DETALLE clásico (provisional — se va a reemplazar con anatomy + color-esquinero + secciones Musotoku) */}
        <div className="relative z-10">
          <ProductDetailSection
            product={product}
            colorPrefix={COLOR_PICKER_PRODUCTS[product.slug]}
          />
        </div>

        {/* RELACIONADOS */}
        {related.length > 0 && (
          <section className="bg-white py-24 md:py-32">
            <div className="mx-auto max-w-[1600px] px-6 md:px-10">
              <h2
                className="mb-10 text-[clamp(2rem,4vw,3rem)] leading-tight text-cobalt"
                style={{ fontFamily: "var(--font-bagel)" }}
              >
                Otros {product.categoryLabel.toLowerCase()}s
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                {related.map((p, i) => (
                  <ProductCard key={p.slug} product={p} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
