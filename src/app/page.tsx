import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { ProductCard } from "@/components/ProductCard";
import { Logo } from "@/components/Logo";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import { CLIENTS } from "@/data/clients";

export default function Home() {
  const featured = [
    PRODUCTS.find((p) => p.slug === "hablador-piso-ov"),
    PRODUCTS.find((p) => p.slug === "hablador-piso-plegable"),
    PRODUCTS.find((p) => p.slug === "hablador-pared-luna"),
    PRODUCTS.find((p) => p.slug === "letras-magneticas"),
  ].filter(Boolean);

  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Header />
      <main>
        <Hero />

        <Marquee
          items={[
            "Avisos hechos en Colombia",
            "Garantía 3 años",
            "Diseño que se ve a metros",
            "By @inkspiracompany",
          ]}
        />

        {/* CATEGORÍAS — bento style */}
        <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-36">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="text-sm font-medium uppercase tracking-widest text-cobalt/60">
                ▷ Catálogo
              </p>
              <h2
                className="mt-6 text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] text-cobalt"
                style={{ fontFamily: "var(--font-bagel)" }}
              >
                19 productos. <br /> 4 categorías. <br /> Infinitas marcas.
              </h2>
            </div>
            <div className="md:col-span-7">
              <p className="text-lg leading-relaxed text-cobalt/85">
                Cada hablador MUFFMENT está diseñado para durar a la intemperie y
                brillar al primer vistazo. Acero cold rolled, pintura
                electrostática, y atención a cada detalle.
              </p>
              <Link
                href="/avisos"
                data-cursor="hover"
                className="mt-8 inline-block rounded-full bg-cobalt px-7 py-3.5 text-sm font-medium uppercase tracking-wider text-cream transition-colors hover:bg-cobalt-dark"
              >
                Ver todo el catálogo →
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/avisos?cat=${cat.id}`}
                data-cursor="hover"
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-cobalt p-6 text-cream transition-transform hover:-translate-y-1 md:aspect-square"
              >
                <span className="text-xs font-medium uppercase tracking-widest text-cream/60">
                  ▷ {cat.count} {cat.count === 1 ? "producto" : "productos"}
                </span>
                <h3
                  className="mt-2 text-2xl leading-tight md:text-3xl"
                  style={{ fontFamily: "var(--font-bagel)" }}
                >
                  {cat.label}
                </h3>
                <span className="absolute bottom-6 right-6 text-2xl transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* DESTACADOS */}
        <section className="bg-cream-light py-24 md:py-36">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10">
            <div className="mb-12 flex items-end justify-between gap-8">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-cobalt/60">
                  ▷ Destacados
                </p>
                <h2
                  className="mt-4 text-[clamp(2rem,5vw,4rem)] leading-tight text-cobalt"
                  style={{ fontFamily: "var(--font-bagel)" }}
                >
                  Los más pedidos
                </h2>
              </div>
              <Link
                href="/avisos"
                data-cursor="hover"
                className="hidden text-sm font-medium uppercase tracking-wider text-cobalt hover:opacity-60 md:inline"
              >
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {featured.map((p, i) => (
                <ProductCard key={p!.slug} product={p!} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* MANIFIESTO */}
        <section className="bg-cobalt py-32 text-cream md:py-44">
          <div className="mx-auto max-w-[1400px] px-6 text-center md:px-10">
            <p className="text-sm font-medium uppercase tracking-widest text-cream/60">
              ▷ Manifiesto
            </p>
            <h2
              className="mt-8 text-[clamp(2.25rem,7vw,7rem)] leading-[0.95]"
              style={{ fontFamily: "var(--font-bagel)" }}
            >
              somos una nueva versión <br /> de los avisos tradicionales.
            </h2>
            <div className="mt-16 grid gap-12 md:grid-cols-3">
              <div>
                <h3
                  className="text-2xl"
                  style={{ fontFamily: "var(--font-bagel)" }}
                >
                  Diseño fresco
                </h3>
                <p className="mt-3 text-cream/80">
                  Tipografías cuidadas, formas memorables, sin clichés de
                  letrero genérico.
                </p>
              </div>
              <div>
                <h3
                  className="text-2xl"
                  style={{ fontFamily: "var(--font-bagel)" }}
                >
                  Hecho en Colombia
                </h3>
                <p className="mt-3 text-cream/80">
                  Acero cold rolled, pintura electrostática, soldadura propia.
                  Garantía por 3 años.
                </p>
              </div>
              <div>
                <h3
                  className="text-2xl"
                  style={{ fontFamily: "var(--font-bagel)" }}
                >
                  Primera impresión
                </h3>
                <p className="mt-3 text-cream/80">
                  Tu cliente decide en 3 segundos. Tu aviso decide por él.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CLIENTES */}
        <section className="bg-cream py-24 md:py-36">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10">
            <div className="mb-12">
              <p className="text-sm font-medium uppercase tracking-widest text-cobalt/60">
                ▷ Clientes muff
              </p>
              <h2
                className="mt-4 text-[clamp(2rem,5vw,4rem)] leading-tight text-cobalt"
                style={{ fontFamily: "var(--font-bagel)" }}
              >
                Marcas que ya hablan con MUFFMENT
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-cobalt/10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {CLIENTS.map((c) => (
                <div
                  key={c.slug}
                  className="flex aspect-[3/2] flex-col items-center justify-center bg-cream-light p-6 text-center transition-colors hover:bg-cobalt hover:text-cream"
                  data-cursor="hover"
                >
                  <span
                    className="text-xl leading-tight md:text-2xl"
                    style={{ fontFamily: "var(--font-bagel)" }}
                  >
                    {c.name}
                  </span>
                  {c.type && (
                    <span className="mt-1 text-xs uppercase tracking-wider opacity-60">
                      {c.type}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-cobalt py-32 text-cream md:py-44">
          <div className="mx-auto max-w-[1400px] px-6 text-center md:px-10">
            <Logo variant="white" size={100} withLink={false} />
            <h2
              className="mx-auto mt-10 max-w-4xl text-[clamp(2.5rem,7vw,7rem)] leading-[0.95]"
              style={{ fontFamily: "var(--font-bagel)" }}
            >
              tu marca merece <br /> un aviso brutal.
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-lg text-cream/85">
              Cuéntanos qué tipo de hablador necesitas. Cotización en 24 horas.
            </p>
            <div className="mt-10">
              <WhatsAppButton
                size="lg"
                className="bg-cream text-cobalt hover:bg-cream-light"
              >
                Empezar por WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
