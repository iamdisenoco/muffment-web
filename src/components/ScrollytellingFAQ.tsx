"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

type Faq = {
  q: string;
  a: string;
  cta?: { label: string; href: string };
};

const FAQS: Faq[] = [
  {
    q: "¿Se puede pintar del color de mi marca?",
    a: "Pintamos con una pintura horneable. Tenemos +90 colores disponibles, seguro encontramos uno que se ajuste a tu marca.",
    cta: { label: "Ver carta de color", href: "/colores" },
  },
  {
    q: "¿Cómo poner la información en nuestros avisos?",
    a: "Tenemos varias opciones para poner la info, sea que la necesites fija o cambiable. Vinilo, letras magnéticas, papel impreso intercambiable, etc.",
    cta: { label: "Ver tipos de información", href: "/info" },
  },
  {
    q: "¿Garantía?",
    a: "Nuestros productos cuentan con 3 años de garantía. Todos llevan un proceso de metalizado antes de pintar que garantiza que no se oxidan ni con lluvia ni con sol.",
  },
];

const VIDEO_SRC = "/videos/plegable-azul.mp4";

export function ScrollytellingFAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Suavizamos el progress con un spring — da inercia cinematográfica.
  // Los videos y FAQs reaccionan ligeramente "tarde", como en landonorris.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 28,
    mass: 0.5,
  });

  return (
    <section
      ref={sectionRef}
      className="relative bg-cobalt text-cream"
      // 130vh por pregunta = más tiempo de scroll para leerlas (en vez del
      // mínimo 100vh donde cambian muy rápido).
      style={{ height: `${FAQS.length * 130}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-cobalt">
        {/* VIDEO DE FONDO — full-screen, loop infinito (no se sincroniza con
            scroll: solo gira siempre como ambient). */}
        <div className="absolute inset-0">
          <video
            src={VIDEO_SRC}
            muted
            loop
            autoPlay
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
        </div>

        {/* CONTENIDO encima del video */}
        <div className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col px-6 py-24 md:px-10 md:py-28">
          {/* HEADER */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-cream/70">
              ▷ Preguntas frecuentes
            </p>
            <h2
              className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.95] drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
              style={{ fontFamily: "var(--font-bagel)" }}
            >
              Lo que más nos preguntan.
            </h2>
          </div>

          {/* FAQs (centradas verticalmente en lo que queda de la pantalla) */}
          <div className="relative mt-auto h-full max-h-[60vh]">
            {FAQS.map((faq, i) => (
              <FaqLayer
                key={i}
                faq={faq}
                index={i}
                total={FAQS.length}
                progress={smoothProgress}
              />
            ))}
          </div>
        </div>

        <ProgressBar progress={smoothProgress} />
      </div>
    </section>
  );
}

// Reservamos 10% al inicio del scroll para que el header sea visible y la
// sección encaje completa antes de que aparezca la primera pregunta.
const HEAD_PADDING = 0.1;

function FaqLayer({
  faq,
  index,
  total,
  progress,
}: {
  faq: Faq;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const usable = 1 - HEAD_PADDING;
  const segment = usable / total;
  const start = HEAD_PADDING + index * segment;
  const end = HEAD_PADDING + (index + 1) * segment;
  // Fades cortos en bordes pero largo plateau central — la pregunta se queda
  // quieta y legible durante la mayor parte de su tramo de scroll.
  const fadeIn = start + 0.04;
  const fadeOut = end - 0.04;
  const opacity = useTransform(
    progress,
    [Math.max(0, start - 0.02), fadeIn, fadeOut, Math.min(1, end + 0.02)],
    [0, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    [Math.max(0, start - 0.02), fadeIn, fadeOut, Math.min(1, end + 0.02)],
    [40, 0, 0, -40],
  );

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center md:items-start md:text-left"
      style={{ opacity, y }}
    >
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-cream/70">
        {String(index + 1).padStart(2, "0")} · {String(total).padStart(2, "0")}
      </span>
      <h3
        className="mt-4 max-w-3xl text-[clamp(1.75rem,4vw,3.25rem)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
        style={{ fontFamily: "var(--font-bagel)" }}
      >
        {faq.q}
      </h3>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/95 drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)] md:text-lg">
        {faq.a}
      </p>
      {faq.cta && (
        <Link
          href={faq.cta.href}
          data-cursor="hover"
          className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-cobalt shadow-lg transition-colors hover:bg-white md:text-sm"
        >
          {faq.cta.label}
          <span aria-hidden>→</span>
        </Link>
      )}
    </motion.div>
  );
}

function ProgressBar({ progress }: { progress: MotionValue<number> }) {
  const height = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div className="pointer-events-none absolute right-6 top-1/2 z-20 hidden h-40 w-px -translate-y-1/2 bg-cream/25 md:block">
      <motion.div className="absolute inset-x-0 top-0 bg-cream shadow-[0_0_8px_rgba(232,226,209,0.6)]" style={{ height }} />
    </div>
  );
}
