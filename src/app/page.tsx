import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Steps } from "@/components/Steps";
import { FAQ } from "@/components/FAQ";
import { Logo } from "@/components/Logo";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CATEGORIES } from "@/data/products";
import { CLIENTS } from "@/data/clients";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Header />
      <main>
        <Hero />

        {/* SEGUNDO SLIDE — Steps + Categorías juntas a altura 100vh, así
            tras un scroll desde el Hero, este bloque encaja como página
            completa igual que el inicio. */}
        <div className="flex min-h-[100svh] flex-col">
          <Steps />

          {/* CATEGORÍAS — flex-1 + items-center para centrar el grid en el
              espacio que sobra dentro del slide. */}
          <section className="flex flex-1 items-center bg-white">
            <div className="mx-auto w-full max-w-[1600px] px-6 py-8 md:px-10 md:py-10">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
                {CATEGORIES.map((cat) => {
                  // Producto sin fondo (PNG con transparencia) por categoría
                  const cover: Record<string, string> = {
                    piso: "/img/products/2026/cutouts/ov.png",
                    pared: "/img/products/2026/cutouts/flag.png",
                    mesa: "/img/products/2026/cutouts/luna.png",
                    accesorio: "/img/products/2026/cutouts/bent.png",
                  };
                  return (
                    <Link
                      key={cat.id}
                      href={`/avisos?cat=${cat.id}`}
                      data-cursor="hover"
                      className="group flex aspect-[3/4] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition-transform hover:-translate-y-1 md:aspect-[5/6]"
                    >
                      {/* Banda superior — altura fija para balance vertical */}
                      <div className="flex h-20 items-start px-6 pt-6">
                        <span className="text-xs font-medium uppercase tracking-widest text-neutral-400">
                          ▷ {cat.count} {cat.count === 1 ? "producto" : "productos"}
                        </span>
                      </div>

                      {/* Producto centrado vertical y horizontal */}
                      <div className="relative flex-1 px-4">
                        <Image
                          src={cover[cat.id]}
                          alt={cat.label}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-contain transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      </div>

                      {/* Banda inferior — misma altura que la superior */}
                      <div className="flex h-20 items-end justify-between gap-2 px-6 pb-6 text-neutral-500">
                        <h3
                          className="text-2xl leading-tight md:text-3xl"
                          style={{ fontFamily: "var(--font-bagel)" }}
                        >
                          {cat.label}
                        </h3>
                        <span className="text-2xl transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* FAQ */}
        <FAQ />

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
