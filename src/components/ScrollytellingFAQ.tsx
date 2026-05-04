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
      data-header-theme="dark"
      className="relative bg-cobalt text-cream"
      // 130vh por pregunta = más tiempo de scroll para leerlas (en vez del
      // mínimo 100vh donde cambian muy rápido).
      style={{ height: `${FAQS.length * 130}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-cobalt">
        {/* VIDEO DE FONDO — doble capa con mask en los bordes.
            - Capa de atrás: video estirado + blur 80px → "expande" el cobalt a los lados
            - Capa de adelante: video nítido con altura completa, ancho automático
              (su bounding box = su contenido) y mask-image lineal que difumina
              los bordes izquierdo/derecho contra el backdrop borroso. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            src={VIDEO_SRC}
            muted
            loop
            autoPlay
            playsInline
            preload="auto"
            aria-hidden
            className="absolute inset-0 hidden h-full w-full scale-125 object-cover blur-[80px] saturate-150 md:block"
          />
          <video
            src={VIDEO_SRC}
            muted
            loop
            autoPlay
            playsInline
            preload="auto"
            className="relative h-full w-auto max-w-full"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
            }}
          />
        </div>

        {/* OVERLAY DE CONTRASTE — gradiente vertical para que el texto se lea
            sobre cualquier frame del video. Más oscuro abajo (donde viven las
            preguntas) y arriba (donde está el header), transparente al medio
            para no tapar el aviso girando. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(11,33,89,0.65) 0%, rgba(11,33,89,0.18) 28%, rgba(11,33,89,0.18) 55%, rgba(11,33,89,0.78) 100%)",
          }}
        />

        {/* CONTENIDO encima del video */}
        <div className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col px-6 py-24 md:px-10 md:py-28">
          {/* HEADER */}
          <div>
            <h2
              className="text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.95] drop-shadow-[0_3px_18px_rgba(0,0,0,0.75)]"
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
    [Math.max(0, start - 0.02), start + 0.015, fadeOut, Math.min(1, end + 0.02)],
    [0, 1, 1, 0],
  );
  // Entrada lateral con rebote: viene de la izquierda (-260), pasa de largo
  // hacia la derecha (+28 = overshoot), corrige (-8 = undershoot) y por fin
  // se asienta en 0. Damping en keyframes simula spring sobre scroll.
  const x = useTransform(
    progress,
    [
      Math.max(0, start - 0.02),
      start,
      start + 0.022,
      start + 0.04,
      fadeIn + 0.005,
      Math.min(1, end + 0.02),
    ],
    [-260, -260, 28, -8, 0, 0],
  );
  // En la salida, sutil deslizamiento hacia arriba para limpiar la siguiente.
  const y = useTransform(
    progress,
    [Math.max(0, start - 0.02), fadeIn, fadeOut, Math.min(1, end + 0.02)],
    [0, 0, 0, -50],
  );

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center md:items-start md:text-left"
      style={{ opacity, x, y }}
    >
      <span className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
        {String(index + 1).padStart(2, "0")} · {String(total).padStart(2, "0")}
      </span>
      <h3
        className="mt-4 max-w-3xl text-[clamp(1.75rem,4vw,3.25rem)] leading-tight drop-shadow-[0_3px_18px_rgba(0,0,0,0.85)]"
        style={{ fontFamily: "var(--font-bagel)" }}
      >
        {faq.q}
      </h3>
      <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] md:text-lg">
        {faq.a}
      </p>
      {faq.cta && (
        <Link
          href={faq.cta.href}
          data-cursor="hover"
          className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-md shadow-lg transition-all hover:border-white/45 hover:bg-white/20 md:text-sm"
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
