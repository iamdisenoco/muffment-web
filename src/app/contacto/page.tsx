import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata = {
  title: "Contacto",
  description: "Cotiza tu aviso MUFFMENT. WhatsApp 304 416 0172.",
};

export default function ContactoPage() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Header />
      <main className="bg-cream pt-32 pb-24">
        <section className="mx-auto max-w-[1400px] px-6 md:px-10">
          <p className="text-sm font-medium uppercase tracking-widest text-cobalt/60">
            ▷ Contacto
          </p>
          <h1
            className="mt-4 text-[clamp(3rem,8vw,8rem)] leading-[0.9] text-cobalt"
            style={{ fontFamily: "var(--font-bagel)" }}
          >
            cuéntanos <br /> tu aviso.
          </h1>
          <p className="mt-8 max-w-xl text-lg text-cobalt/85">
            Cotización en 24 horas. Diseñamos en Colombia, fabricamos en
            Colombia, despachamos a todo el país.
          </p>
        </section>

        <section className="mx-auto mt-20 max-w-[1400px] px-6 md:px-10">
          <div className="grid gap-px overflow-hidden rounded-3xl bg-cobalt/15 md:grid-cols-3">
            <Card
              kicker="▷ Lo más rápido"
              title="WhatsApp"
              value="304 416 0172"
              cta={
                <WhatsAppButton
                  size="md"
                  className="mt-6 bg-cobalt text-cream hover:bg-cobalt-dark"
                >
                  Abrir chat
                </WhatsAppButton>
              }
            />
            <Card
              kicker="▷ Llamada directa"
              title="Teléfono"
              value="304 416 0172"
              cta={
                <a
                  href="tel:+573044160172"
                  data-cursor="hover"
                  className="mt-6 inline-flex items-center justify-center rounded-full border border-cobalt px-6 py-3 text-sm font-medium uppercase tracking-wider text-cobalt transition-colors hover:bg-cobalt hover:text-cream"
                >
                  Marcar
                </a>
              }
            />
            <Card
              kicker="▷ Síguenos"
              title="Instagram"
              value="@muffment"
              cta={
                <a
                  href="https://instagram.com/muffment"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="mt-6 inline-flex items-center justify-center rounded-full border border-cobalt px-6 py-3 text-sm font-medium uppercase tracking-wider text-cobalt transition-colors hover:bg-cobalt hover:text-cream"
                >
                  Ver perfil
                </a>
              }
            />
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-[1000px] px-6 md:px-10">
          <div className="rounded-3xl bg-cobalt p-10 text-cream md:p-16">
            <p className="text-sm font-medium uppercase tracking-widest text-cream/60">
              ▷ ¿Necesitas algo a la medida?
            </p>
            <h2
              className="mt-6 text-[clamp(2rem,5vw,4rem)] leading-tight"
              style={{ fontFamily: "var(--font-bagel)" }}
            >
              Sí, también hacemos eso.
            </h2>
            <p className="mt-6 max-w-xl text-lg text-cream/85">
              Si tu marca pide un aviso fuera del catálogo (medidas, materiales,
              luminoso, doble cara, lo que sea) — lo diseñamos contigo. Mándanos
              tu logo y referencia por WhatsApp y te volvemos con propuesta.
            </p>
            <div className="mt-8">
              <WhatsAppButton
                message="Hola MUFFMENT, quiero un aviso a la medida. Te paso el contexto:"
                size="lg"
                className="bg-cream text-cobalt hover:bg-cream-light"
              >
                Pedir cotización a medida
              </WhatsAppButton>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-[1400px] px-6 text-center text-cobalt/60 md:px-10">
          <p className="text-xs uppercase tracking-[0.3em]">
            ✦ Diseñados y fabricados en Colombia ✦ Garantía por 3 años ✦
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Card({
  kicker,
  title,
  value,
  cta,
}: {
  kicker: string;
  title: string;
  value: string;
  cta: React.ReactNode;
}) {
  return (
    <div className="flex flex-col bg-cream-light p-10">
      <p className="text-xs font-medium uppercase tracking-widest text-cobalt/60">
        {kicker}
      </p>
      <h3
        className="mt-4 text-3xl text-cobalt"
        style={{ fontFamily: "var(--font-bagel)" }}
      >
        {title}
      </h3>
      <p className="mt-2 text-lg text-cobalt/85">{value}</p>
      {cta}
    </div>
  );
}
