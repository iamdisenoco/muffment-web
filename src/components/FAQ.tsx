"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Item = {
  q: string;
  a: string;
  cta?: { label: string; href: string };
};

const ITEMS: Item[] = [
  {
    q: "¿Se puede pintar del color de mi marca?",
    a: "Pintamos con una pintura horneable. Tenemos +90 colores disponibles, seguro encontramos uno que se ajuste a tu marca.",
    cta: { label: "Ver carta de color", href: "/colores" },
  },
  {
    q: "¿Cómo poner la información en nuestros avisos?",
    a: "Tenemos varias opciones para poner la info, sea que la necesites fija o cambiable.",
    cta: { label: "Ver tipos de información", href: "/info" },
  },
  {
    q: "¿Garantía?",
    a: "Nuestros productos cuentan con 3 años de garantía. Todos llevan un proceso de metalizado antes de pintar que garantiza que no se oxidan.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-cobalt py-16 text-cream md:py-24">
      <div className="mx-auto max-w-[1100px] px-6 md:px-10">
        <p className="text-xs font-medium uppercase tracking-widest text-cream/60">
          ▷ Preguntas frecuentes
        </p>
        <h2
          className="mt-6 text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95]"
          style={{ fontFamily: "var(--font-bagel)" }}
        >
          Lo que más nos <br /> preguntan.
        </h2>

        <div className="mt-14 divide-y divide-cream/15 border-y border-cream/15">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  data-cursor="hover"
                  className="group flex w-full items-center justify-between gap-6 py-7 text-left md:py-9"
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-2xl leading-tight md:text-4xl"
                    style={{ fontFamily: "var(--font-bagel)" }}
                  >
                    {item.q}
                  </span>
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cream/40 transition-transform ${
                      isOpen ? "rotate-45" : ""
                    } md:h-12 md:w-12`}
                    aria-hidden
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pr-16 md:pb-10">
                        <p className="text-base leading-relaxed text-cream/85 md:text-lg">
                          {item.a}
                        </p>
                        {item.cta && (
                          <Link
                            href={item.cta.href}
                            data-cursor="hover"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-xs font-medium uppercase tracking-wider text-cobalt transition-colors hover:bg-white md:text-sm"
                          >
                            {item.cta.label}
                            <span aria-hidden>→</span>
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
