import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Steps } from "@/components/Steps";
import { ScrollytellingFAQ } from "@/components/ScrollytellingFAQ";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ProductCatalog } from "@/components/ProductCatalog";
import { PRODUCTS } from "@/data/products";
import { CLIENTS } from "@/data/clients";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Header />
      <main>
        <Hero />

        {/* SEGUNDO SLIDE — Steps con su tamaño original (franja compacta).
            id="segundo-slide" para el botón "Scroll to explore" del Hero. */}
        <div id="segundo-slide" className="snap-start">
          <Steps />
        </div>

        {/* TODOS LOS AVISOS — bg cobalt (color de marca), sin título; el
            filtro flotante futurista es el único elemento estructural. */}
        <section data-header-theme="dark" className="bg-cobalt py-16 md:py-20">
          <div className="mx-auto max-w-[1800px] px-3 md:px-6">
            <ProductCatalog products={PRODUCTS} />
          </div>
        </section>

        {/* FAQ — scrollytelling con video del plegable + preguntas
            sincronizadas al scroll. */}
        <ScrollytellingFAQ />

        {/* MANIFIESTO */}
        <section data-header-theme="dark" className="bg-cobalt py-20 text-cream md:py-28">
          <div className="mx-auto max-w-[1400px] px-6 text-center md:px-10">
            <h2
              className="text-[clamp(2.25rem,7vw,7rem)] leading-[0.95]"
              style={{ fontFamily: "var(--font-bagel)" }}
            >
              Diseñamos para que te recuerden.
            </h2>
            <div className="mt-20 grid gap-10 md:grid-cols-3 md:gap-16">
              {["Diseño fresco", "Minimalista", "Impactante"].map((word) => (
                <h3
                  key={word}
                  className="text-[clamp(1.5rem,2.5vw,2.25rem)] font-bold uppercase tracking-wide leading-tight"
                  style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
                >
                  {word}
                </h3>
              ))}
            </div>
          </div>
        </section>

        {/* CLIENTES */}
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10">
            <div className="mb-12">
              <h2
                className="text-[clamp(2rem,5vw,4rem)] leading-tight text-cobalt"
                style={{ fontFamily: "var(--font-bagel)" }}
              >
                Marcas que ya hablan con MUFFMENT
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-cobalt/10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {CLIENTS.map((c) => (
                <div
                  key={c.slug}
                  className="flex aspect-[3/2] flex-col items-center justify-center bg-white p-6 text-center transition-colors hover:bg-cobalt hover:text-cream"
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

      </main>
      <Footer />
    </>
  );
}
