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
    hoverText: "Ver productos",
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
    hoverText: "Ver formas para poner mi info",
    href: "/info",
  },
];

function StepBadge({ step }: { step: Step }) {
  const [hovered, setHovered] = useState(false);

  // Path semi-circular arriba del círculo del número
  const TEXT_PATH = "M 30 160 A 110 110 0 0 1 250 160";
  const TEXT_PATH_ID = `textpath-${step.n}`;

  const curvedText = step.defaultText.toUpperCase();

  // Tamaño del texto del hover dentro del círculo (Bagel) según largo
  const hoverFontSize =
    step.hoverText.length > 22 ? 13 : step.hoverText.length > 14 ? 18 : 24;

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

          {/* Texto curvo arriba siguiendo el arc — NEGRO sobre el cream.
              Auto-ajusta tamaño si el texto es muy largo (>20 chars). */}
          <text
            fill="#000"
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

          {/* Contenido del círculo: número (default) o hoverText (hover),
              ambos en Bagel ("tipografía redondita"). foreignObject permite
              wrap del texto largo dentro del círculo. */}
          <foreignObject x="78" y="98" width="124" height="124">
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-cream)",
                textAlign: "center",
                padding: "0 6px",
                boxSizing: "border-box",
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {hovered ? (
                  <motion.span
                    key="hover"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      fontFamily: "var(--font-bagel)",
                      fontSize: hoverFontSize,
                      lineHeight: 1.05,
                      display: "block",
                    }}
                  >
                    {step.hoverText}
                  </motion.span>
                ) : (
                  <motion.span
                    key="default"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      fontFamily: "var(--font-bagel)",
                      fontSize: 56,
                      lineHeight: 1,
                      display: "block",
                    }}
                  >
                    {step.n}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </foreignObject>
        </svg>
      </motion.div>
    </Link>
  );
}

export function Steps() {
  return (
    <section className="bg-cream pt-4 pb-0 md:pt-6 md:pb-2">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
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
