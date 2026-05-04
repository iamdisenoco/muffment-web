import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { PRODUCTS, getProduct } from "@/data/products";
import { whatsappLink } from "@/lib/utils";

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

  const message = `Hola MUFFMENT, quiero el ${product.name} (${product.priceLabel}). ¿Me ayudas con la cotización?`;

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

        {/* DETALLE */}
        <section className="mx-auto mt-8 grid max-w-[1600px] gap-10 px-6 pb-24 md:grid-cols-12 md:gap-16 md:px-10 md:pb-36">
          {/* Visual con galería interactiva */}
          <div className="md:col-span-7">
            <ProductGallery
              hero={product.hero}
              gallery={product.gallery}
              alt={product.name}
              fallbackCode={product.code}
              fallbackName={product.shortName}
            />
          </div>

          {/* Info */}
          <div className="md:col-span-5 md:sticky md:top-32 md:self-start">
            <h1
              className="text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] text-cobalt"
              style={{ fontFamily: "var(--font-bagel)" }}
            >
              {product.name}
            </h1>

            <div className="mt-6 flex items-baseline gap-3">
              <span
                className="text-5xl text-cobalt"
                style={{ fontFamily: "var(--font-bagel)" }}
              >
                {product.priceLabel}
              </span>
              {product.priceEstimated && (
                <span className="text-xs font-medium uppercase tracking-wider text-black/60">
                  desde · final según diseño
                </span>
              )}
            </div>

            <p className="mt-8 text-lg leading-relaxed text-black/85">
              {product.description}
            </p>

            <dl className="mt-10 space-y-4 border-t border-black/15 pt-8 text-sm">
              <Row label="Dimensiones totales" value={product.totalSize} />
              <Row label="Dimensiones para el arte" value={product.artSize} />
              <Row label="Materiales" value={product.materials} />
              <Row label="Pintura" value={product.paint} />
              {product.notes && <Row label="Nota" value={product.notes} />}
            </dl>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton message={message} size="lg">
                Pedirlo a WhatsApp
              </WhatsAppButton>
              <a
                href={whatsappLink(
                  `Hola MUFFMENT, quiero el ${product.name} pero a la medida. ¿Cómo cotizamos?`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="inline-flex items-center justify-center rounded-full border border-cobalt px-6 py-4 text-base font-medium uppercase tracking-wider text-cobalt transition-colors hover:bg-cobalt hover:text-cream"
              >
                Pedirlo a la medida
              </a>
            </div>

            <p className="mt-6 text-xs uppercase tracking-widest text-black/50">
              ✦ Garantía 3 años ✦ Hecho en Colombia ✦
            </p>
          </div>
        </section>

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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 md:grid-cols-[180px_1fr]">
      <dt className="text-xs font-medium uppercase tracking-wider text-black/60">
        {label}
      </dt>
      <dd className="text-cobalt">{value}</dd>
    </div>
  );
}
