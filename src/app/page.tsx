import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Steps } from "@/components/Steps";
import { ScrollytellingFAQ } from "@/components/ScrollytellingFAQ";
import { Logo } from "@/components/Logo";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { WhatsAppButton } from "@/components/WhatsAppButton";
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
        <section className="bg-cobalt py-16 md:py-20">
          <div className="mx-auto max-w-[1800px] px-3 md:px-6">
            <ProductCatalog products={PRODUCTS} />
          </div>
        </section>

        {/* FAQ — scrollytelling con video del plegable + preguntas
            sincronizadas al scroll. */}
        <ScrollytellingFAQ />

        {/* MANIFIESTO */}
        <section className="bg-cobalt py-20 text-cream md:py-28">
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
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10">
            <div className="mb-12">
              <p className="text-sm font-medium uppercase tracking-widest text-black/60">
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

        {/* CTA FINAL */}
        <section className="bg-cobalt py-20 text-cream md:py-28">
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
                className="bg-cream text-cobalt hover:bg-white"
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
