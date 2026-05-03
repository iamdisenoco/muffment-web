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

        <Steps />

        {/* CATEGORÍAS — pegadas a los Steps */}
        <section className="mx-auto max-w-[1600px] px-6 pt-2 pb-16 md:px-10 md:pt-4 md:pb-24">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {CATEGORIES.map((cat) => {
              // Producto sin fondo (PNG con transparencia) para cada categoría
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
                  className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition-transform hover:-translate-y-1 md:aspect-square"
                >
                  {/* Producto centrado en la mitad superior, no se solapa con el texto */}
                  <div className="absolute inset-x-0 top-0 bottom-[35%] flex items-center justify-center p-6">
                    <Image
                      src={cover[cat.id]}
                      alt={cat.label}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  {/* Texto en GRIS, abajo, sin solaparse con el producto */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col p-6">
                    <span className="text-xs font-medium uppercase tracking-widest text-neutral-400">
                      ▷ {cat.count} {cat.count === 1 ? "producto" : "productos"}
                    </span>
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-6 text-neutral-500">
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
        </section>

        {/* FAQ */}
        <FAQ />

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
        <section className="bg-white py-24 md:py-36">
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
