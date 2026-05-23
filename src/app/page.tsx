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

        {/* MANIFIESTO — diseño editorial asimétrico con número gigante */}
        <section
          data-header-theme="dark"
          className="has-grain relative overflow-hidden bg-cobalt py-24 text-cream md:py-36"
        >
          {/* Número de sección flotante atrás, decorativo */}
          <div
            aria-hidden
            className="anim-fade pointer-events-none absolute -top-8 right-[-4vw] select-none text-[28vw] leading-none text-cream/[0.045] md:-top-20 md:right-[-2vw]"
            style={{ fontFamily: "var(--font-bagel)" }}
          >
            01
          </div>

          {/* Decorative dots blob */}
          <div
            aria-hidden
            className="anim-blob pointer-events-none absolute left-[12%] top-[15%] h-3 w-3 rounded-full bg-[#ff6b35]"
          />
          <div
            aria-hidden
            className="anim-blob pointer-events-none absolute right-[18%] bottom-[20%] h-4 w-4 rounded-full bg-[#f9c80e]"
            style={{ animationDelay: "-7s" }}
          />

          <div className="relative mx-auto max-w-[1500px] px-6 md:px-12">
            {/* Marker eyebrow editorial */}
            <p
              className="anim-rise mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-cream/55"
              style={{ animationDelay: "0.05s" }}
            >
              <span className="inline-block h-px w-10 bg-cream/35" />
              Manifiesto · 2026
            </p>

            {/* Headline asimétrico — mezcla Bagel display + Campton italic */}
            <h2
              className="anim-rise max-w-[15ch] text-[clamp(2.75rem,9vw,9rem)] leading-[0.88] tracking-tight"
              style={{ fontFamily: "var(--font-bagel)", animationDelay: "0.15s" }}
            >
              Diseñamos
              <br />
              <span className="block translate-x-[10%]">para que</span>
              <em
                className="block translate-x-[-4%] not-italic text-[#f9c80e]"
                style={{ fontFamily: "var(--font-bagel)" }}
              >
                te recuerden.
              </em>
            </h2>

            {/* 3 valores con composicion offset */}
            <div className="mt-24 grid gap-12 md:mt-32 md:grid-cols-12 md:gap-x-8">
              {[
                { num: "i", word: "Diseño", word2: "fresco", color: "#06d6a0" },
                { num: "ii", word: "Minima", word2: "lista", color: "#ef476f", offset: "md:translate-y-12" },
                { num: "iii", word: "Impac", word2: "tante", color: "#4cc9f0", offset: "md:translate-y-24" },
              ].map((item, i) => (
                <div
                  key={item.word}
                  className={`anim-rise md:col-span-4 ${item.offset ?? ""}`}
                  style={{ animationDelay: `${0.3 + i * 0.12}s` }}
                >
                  <div className="flex items-baseline gap-3">
                    <span
                      className="text-xs uppercase tracking-[0.3em] text-cream/45"
                      style={{ fontFamily: '"Satoshi", system-ui' }}
                    >
                      {item.num}
                    </span>
                    <span
                      aria-hidden
                      className="h-px flex-1 origin-left scale-x-100 bg-cream/15"
                    />
                  </div>
                  <h3
                    className="mt-4 text-[clamp(2rem,4vw,3.5rem)] leading-[0.9] tracking-tight"
                    style={{ fontFamily: "var(--font-bagel)" }}
                  >
                    {item.word}
                    <br />
                    <span style={{ color: item.color }}>{item.word2}.</span>
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLIENTES — grid editorial con cards de tamaños mixtos y hover dramático */}
        <section className="has-grain relative overflow-hidden bg-cream py-24 md:py-32">
          {/* Número 02 decorativo */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-12 left-[-4vw] select-none text-[26vw] leading-none text-cobalt/[0.05]"
            style={{ fontFamily: "var(--font-bagel)" }}
          >
            02
          </div>

          <div className="relative mx-auto max-w-[1600px] px-6 md:px-10">
            {/* Header editorial: eyebrow + headline + nota lateral */}
            <div className="mb-16 grid gap-8 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-8">
                <p className="mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-cobalt/55">
                  <span className="inline-block h-px w-10 bg-cobalt/30" />
                  Clientes · 02
                </p>
                <h2
                  className="text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.92] tracking-tight text-cobalt"
                  style={{ fontFamily: "var(--font-bagel)" }}
                >
                  Marcas que ya<br />
                  <span className="italic text-cobalt/70" style={{ fontFamily: '"Satoshi", system-ui' }}>
                    hablan con
                  </span>{" "}
                  MUFFMENT.
                </h2>
              </div>
              <div className="flex flex-col justify-end md:col-span-4">
                <p className="text-sm leading-relaxed text-cobalt/65 md:text-base">
                  Desde cafés de especialidad hasta hoteles boutique, restaurantes,
                  salones y retail. Cada marca con su propio aviso.
                </p>
              </div>
            </div>

            {/* Grid de clientes - una marca destacada + el resto */}
            {CLIENTS.length > 0 && (
              <div className="grid gap-4 md:grid-cols-6 md:gap-5">
                {/* Marca destacada - primera */}
                {CLIENTS.slice(0, 1).map((c) => (
                  <div
                    key={c.slug}
                    data-cursor="hover"
                    className="group relative flex aspect-square flex-col items-start justify-between overflow-hidden rounded-3xl border border-cobalt/15 bg-cobalt p-6 text-cream transition-all hover:scale-[1.01] hover:shadow-xl md:col-span-2 md:row-span-2 md:aspect-auto md:p-10"
                  >
                    <span className="text-[10px] uppercase tracking-[0.3em] text-cream/55">
                      ✦ Featured
                    </span>
                    <div>
                      <h3
                        className="text-[clamp(2rem,3vw,3.5rem)] leading-[0.95]"
                        style={{ fontFamily: "var(--font-bagel)" }}
                      >
                        {c.name}
                      </h3>
                      {c.type && (
                        <p className="mt-3 text-xs uppercase tracking-wider opacity-70">
                          {c.type}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Resto del grid */}
                {CLIENTS.slice(1).map((c, i) => {
                  const accents = ["#ff6b35", "#f9c80e", "#06d6a0", "#ef476f", "#4cc9f0"];
                  const accent = accents[i % accents.length];
                  return (
                    <div
                      key={c.slug}
                      data-cursor="hover"
                      className="group relative flex aspect-[4/3] flex-col items-start justify-end overflow-hidden rounded-2xl border border-cobalt/10 bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-lg md:aspect-square"
                    >
                      {/* Hover overlay con color acento */}
                      <div
                        aria-hidden
                        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{ backgroundColor: accent }}
                      />
                      <div className="relative">
                        <h3
                          className="text-xl leading-tight text-cobalt transition-colors group-hover:text-white md:text-2xl"
                          style={{ fontFamily: "var(--font-bagel)" }}
                        >
                          {c.name}
                        </h3>
                        {c.type && (
                          <p className="mt-1 text-[10px] uppercase tracking-wider text-cobalt/55 transition-colors group-hover:text-white/85">
                            {c.type}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
