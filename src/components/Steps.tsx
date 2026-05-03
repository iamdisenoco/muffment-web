"use client";

import { motion } from "motion/react";

const STEPS = [
  { n: "01", text: "Escoge tu aviso" },
  { n: "02", text: "Escoge tu color" },
  { n: "03", text: "Escoge cómo poner tu mensaje" },
];

export function Steps() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-3 md:gap-0">
          {STEPS.map((step, i) => {
            const isLast = i === STEPS.length - 1;
            return (
              <div
                key={step.n}
                className="relative flex flex-col items-center text-center md:px-6"
              >
                {/* Línea conectora hacia el siguiente paso (oculta en mobile) */}
                {!isLast && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute left-[calc(50%+3.5rem)] top-12 hidden h-px w-[calc(100%-7rem)] md:block"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, var(--color-cobalt) 0 8px, transparent 8px 16px)",
                    }}
                  />
                )}

                {/* Círculo con número */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-cobalt text-cream md:h-28 md:w-28"
                >
                  <span
                    className="text-3xl leading-none md:text-4xl"
                    style={{ fontFamily: "var(--font-bagel)" }}
                  >
                    {step.n}
                  </span>
                </motion.div>

                {/* Texto del paso */}
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.15 + 0.2,
                    ease: [0.21, 0.6, 0.35, 1],
                  }}
                  className="mt-6 max-w-[18ch] text-base font-semibold uppercase tracking-[0.15em] text-cobalt md:text-lg"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {step.text}
                </motion.p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
