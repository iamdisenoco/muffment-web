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

function StepBadge({ step, index, total }: { step: Step; index: number; total: number }) {
  const [hovered, setHovered] = useState(false);
  const isLast = index === total - 1;

  // Path semi-circular arriba del círculo del número (arc TOP)
  // viewBox 280×280, círculo num cx=140 cy=160 r=62
  // Texto arriba siguiendo arc radio 110 desde left a right
  const TEXT_PATH = "M 30 160 A 110 110 0 0 1 250 160";
  const TEXT_PATH_ID = `textpath-${step.n}`;

  // Texto a mostrar (default o hover)
  const text = (hovered ? step.hoverText : step.defaultText).toUpperCase();

  return (
    <div className="relative flex flex-col items-center">
      {/* Línea conectora hacia el siguiente paso */}
      {!isLast && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-[calc(50%+5rem)] top-[140px] hidden h-px w-[calc(100%-10rem)] md:block"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--color-cobalt) 0 8px, transparent 8px 16px)",
          }}
        />
      )}

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

            {/* Texto curvo arriba siguiendo el arc */}
            <text
              fill="var(--color-cobalt)"
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: 19,
                letterSpacing: "0.18em",
              }}
            >
              <textPath href={`#${TEXT_PATH_ID}`} startOffset="50%" textAnchor="middle">
                {text}
              </textPath>
            </text>

            {/* Círculo del número */}
            <circle cx="140" cy="160" r="62" fill="var(--color-cobalt)" />

            {/* Número en el centro */}
            <text
              x="140"
              y="183"
              textAnchor="middle"
              fill="var(--color-cream)"
              style={{
                fontFamily: "var(--font-bagel)",
                fontSize: 56,
              }}
            >
              {step.n}
            </text>

            {/* Flecha al hover (sutil) */}
            <AnimatePresence>
              {hovered && (
                <motion.text
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  x="140"
                  y="240"
                  textAnchor="middle"
                  fill="var(--color-cobalt)"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    fontSize: 22,
                  }}
                >
                  →
                </motion.text>
              )}
            </AnimatePresence>
          </svg>
        </motion.div>
      </Link>
    </div>
  );
}

export function Steps() {
  return (
    <section className="bg-white pt-12 pb-0 md:pt-20 md:pb-2">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid grid-cols-1 items-start justify-items-center gap-8 md:grid-cols-3 md:gap-0"
        >
          {STEPS.map((step, i) => (
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
              <StepBadge step={step} index={i} total={STEPS.length} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
