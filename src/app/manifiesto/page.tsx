import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Logo } from "@/components/Logo";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata = {
  title: "Manifiesto",
  description:
    "Somos una nueva versión de los avisos tradicionales. Diseñados y fabricados en Colombia.",
};

export default function ManifiestoPage() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Header />
      <main className="bg-white">
        {/* HERO MANIFIESTO */}
        <section className="relative min-h-[100svh] overflow-hidden bg-cobalt text-cream">
          <div className="relative mx-auto flex min-h-[100svh] max-w-[1400px] flex-col items-center justify-center px-6 pb-20 pt-32 text-center md:px-10">
            <p className="text-sm font-medium uppercase tracking-widest text-cream/60">
              ▷ Manifiesto MUFFMENT
            </p>
            <h1
              className="mt-8 max-w-[18ch] text-[clamp(3rem,9vw,9rem)] leading-[0.9] tracking-tight"
              style={{ fontFamily: "var(--font-bagel)" }}
            >
              creative signs <br /> for creative <br /> businesses.
            </h1>
            <p className="mt-12 max-w-2xl text-xl text-cream/85 md:text-2xl">
              Somos una nueva versión de los avisos tradicionales.
            </p>
          </div>
        </section>

        {/* PRINCIPIOS */}
        <section className="bg-white py-32 md:py-44">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <p className="text-sm font-medium uppercase tracking-widest text-black/60">
              ▷ Cómo lo hacemos
            </p>
            <h2
              className="mt-6 text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] text-cobalt"
              style={{ fontFamily: "var(--font-bagel)" }}
            >
              cada detalle <br /> es importante.
            </h2>

            <div className="mt-20 space-y-20">
              <Principle
                num="01"
                title="Diseño fresco"
                body="No hacemos avisos. Hacemos piezas que tu marca merece. Tipografías cuidadas, formas memorables, color con propósito. Nada genérico, nada de plantillas."
              />
              <Principle
                num="02"
                title="Acero de verdad"
                body="Cold rolled, inoxidable o galvanizado según el aviso. Pintura electrostática horneada para sol, lluvia, polvo y mugre de calle. Soldadura propia, cordón limpio."
              />
              <Principle
                num="03"
                title="Garantía 3 años"
                body="Si algo falla en pintura, soldadura o estructura en los primeros 3 años, lo arreglamos sin pelear. Eso es lo que diferencia un fabricante de un revendedor."
              />
              <Principle
                num="04"
                title="Hecho en Colombia"
                body="100% diseñado y fabricado acá. Cuando compras MUFFMENT, pagas trabajo colombiano y diseño colombiano."
              />
              <Principle
                num="05"
                title="Primera impresión"
                body="Tu cliente decide en 3 segundos si entra o sigue de largo. Tu aviso decide por él. Por eso cada detalle importa: la fuente, el color, el formato, la altura, la posición."
              />
            </div>
          </div>
        </section>

        {/* QUIÉNES */}
        <section className="bg-cobalt py-32 text-cream md:py-44">
          <div className="mx-auto max-w-[1200px] px-6 text-center md:px-10">
            <Logo variant="white" size={120} withLink={false} />
            <h2
              className="mx-auto mt-10 max-w-3xl text-[clamp(2rem,5vw,4rem)] leading-tight"
              style={{ fontFamily: "var(--font-bagel)" }}
            >
              MUFFMENT es un proyecto de
              <br />
              <a
                href="https://instagram.com/inkspiracompany"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="underline decoration-cream/40 underline-offset-8 transition-colors hover:decoration-cream"
              >
                @inkspiracompany
              </a>
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-lg text-cream/85">
              Diseño industrial, taller propio, atención obsesiva al detalle.
              Si tu marca habla por ti, MUFFMENT le da el micrófono.
            </p>
            <div className="mt-12">
              <WhatsAppButton
                size="lg"
                className="bg-cream text-cobalt hover:bg-white"
              >
                Empezar tu aviso
              </WhatsAppButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Principle({
  num,
  title,
  body,
}: {
  num: string;
  title: string;
  body: string;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-12 md:gap-12">
      <span
        className="text-7xl text-cobalt/30 md:col-span-2 md:text-8xl"
        style={{ fontFamily: "var(--font-bagel)" }}
      >
        {num}
      </span>
      <div className="md:col-span-10">
        <h3
          className="text-3xl text-cobalt md:text-5xl"
          style={{ fontFamily: "var(--font-bagel)" }}
        >
          {title}
        </h3>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-black/85">
          {body}
        </p>
      </div>
    </div>
  );
}
