import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailSection } from "@/components/ProductDetailSection";
import { PRODUCTS, getProduct } from "@/data/products";

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

  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Header />
      <main className="relative bg-white pt-32">
        {/* Franja cobalt UN SOLO gradient continuo (sin línea dura).
            Antes tenía 2 divs (banda sólida + fade) que creaban un
            quiebre visual donde terminaba la banda. Ahora 1 div con
            el "sólido" + "fade" integrados:
              0%    → cobalt sólido (top)
              35%   → cobalt sólido (banda llena cubre header+breadcrumb)
              70%   → cobalt 0.15 (mismo stop intermedio que el bottom-hero)
              100%  → transparente (revela bg-white)
            Mismo stop intermedio (0.15) y misma estructura que el fade
            bottom-hero que sí funciona, pero más largo (256/320px) y
            CONTINUO sin discontinuidades. */}
        <div
          aria-hidden
          data-header-theme="dark"
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[256px] md:h-[320px]"
          style={{
            background:
              "linear-gradient(to bottom, rgb(50,54,183) 0%, rgb(50,54,183) 35%, rgba(50,54,183,0.15) 70%, rgba(255,255,255,0) 100%)",
          }}
        />

        {/* Breadcrumb editorial-técnico — sobre la franja cobalt usa cream */}
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

        {/* DETALLE (client component, maneja state del color) */}
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
