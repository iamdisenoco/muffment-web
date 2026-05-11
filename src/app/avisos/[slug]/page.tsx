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
 *  No incluye productos con fotos lifestyle (mesa-rect, doble-lamina-portable,
 *  menu-swinger) ni el mesa-clear (acrílico transparente, sin color base). */
const COLOR_PICKER_PRODUCTS: Record<string, string> = {
  "hablador-piso-ov": "ov",
  "hablador-piso-plegable": "plegable",
  "hablador-piso-plegable-small": "plegable-small",
  "hablador-piso-top-shelf": "top-shelf",
  "hablador-piso-bent": "bent",
  "hablador-piso-paleta-redondo": "paleta-redondo",
  "hablador-piso-p-ov": "p-ov",
  "hablador-piso-p-rect": "p-rect",
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
      <main className="bg-white pt-32">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <nav className="text-xs uppercase tracking-widest text-black/60">
            <Link href="/avisos" className="hover:opacity-70">
              ← Catálogo
            </Link>
            <span className="mx-3">/</span>
            <Link
              href={`/avisos?cat=${product.category}`}
              className="hover:opacity-70"
            >
              {product.categoryLabel}
            </Link>
          </nav>
        </div>

        {/* DETALLE (client component, maneja state del color) */}
        <ProductDetailSection
          product={product}
          colorPrefix={COLOR_PICKER_PRODUCTS[product.slug]}
        />

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
