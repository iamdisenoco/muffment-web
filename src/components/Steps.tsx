"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

type Step = {
  n: string;
  defaultText: string;
  hoverText: string;
  href: string;
};

const STEPS: Step[] = [
  {
    n: "01",
    defaultText: "Escoge tu aviso",
    hoverText: "Ver avisos",
    href: "/avisos",
  },
  {
    n: "02",
    defaultText: "Escoge tu color",
    hoverText: "Ver colores",
    href: "/colores",
  },
  {
    n: "03",
    defaultText: "Escoge cómo poner tu mensaje",
    hoverText: "Ver formas para la info",
    href: "/info",
  },
];

function StepBadge({ step }: { step: Step }) {
  const [hovered, setHovered] = useState(false);

  // Path semi-circular arriba del círculo del número
  const TEXT_PATH = "M 30 160 A 110 110 0 0 1 250 160";
  const TEXT_PATH_ID = `textpath-${step.n}`;

  // Texto curvo: cambia entre defaultText y hoverText según el cursor.
  const curvedText = (hovered ? step.hoverText : step.defaultText).toUpperCase();

  return (
    <Link
      href={step.href}
      data-cursor="hover"
      aria-label={step.defaultText}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative z-10 block"
    >
      <motion.div
        animate={{ scale: hovered ? 1.12 : 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <svg
          viewBox="0 0 280 280"
          width="220"
          height="220"
          className="h-[180px] w-[180px] md:h-[220px] md:w-[220px]"
          aria-hidden
        >
          <defs>
            <path id={TEXT_PATH_ID} d={TEXT_PATH} fill="none" />
          </defs>

          {/* Texto curvo arriba — gris sobre cream. */}
          <text
            fill="#6b6b6b"
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: curvedText.length > 20 ? 14 : 17,
              letterSpacing: curvedText.length > 20 ? "0.06em" : "0.1em",
            }}
          >
            <textPath href={`#${TEXT_PATH_ID}`} startOffset="50%" textAnchor="middle">
              {curvedText}
            </textPath>
          </text>

          {/* Círculo del número */}
          <circle cx="140" cy="160" r="62" fill="var(--color-cobalt)" />

          {/* Centro del círculo: número en idle, flecha → en hover.
              Ambos en Bagel ("tipografía redondita"). */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.text
              key={hovered ? "arrow" : "number"}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              x="140"
              y="183"
              textAnchor="middle"
              fill="var(--color-cream)"
              style={{
                fontFamily: "var(--font-bagel)",
                fontSize: 56,
              }}
            >
              {hovered ? "→" : step.n}
            </motion.text>
          </AnimatePresence>
        </svg>
      </motion.div>
    </Link>
  );
}

export function Steps() {
  return (
    <section className="bg-cream pt-24 pb-0 md:pt-28 md:pb-1">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Título de sección — pt grande arriba para que el header fixed
            no se monte sobre 'proceso de compra'. */}
        <div className="mb-4 text-center md:mb-6">
          <h2
            className="text-cobalt"
            style={{
              fontFamily: "var(--font-bagel)",
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              lineHeight: 1,
            }}
          >
            proceso de compra
          </h2>
        </div>

        <div className="relative">
          {/* Línea punteada horizontal cruzando los 3 pasos.
              Posicionada al centro vertical del círculo del número.
              Los círculos cobalt sólidos la tapan donde corresponde. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[16%] right-[16%] top-[50%] hidden h-px md:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, var(--color-cobalt) 0 10px, transparent 10px 20px)",
            }}
          />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } },
            }}
            className="relative grid grid-cols-1 items-center justify-items-center gap-8 md:grid-cols-3 md:gap-0"
          >
            {STEPS.map((step) => (
              <motion.div
                key={step.n}
                variants={{
                  hidden: { opacity: 0, scale: 0.7 },
                  show: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className="relative"
              >
                <StepBadge step={step} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
