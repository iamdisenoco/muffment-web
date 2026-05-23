"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const MESSAGES = [
  "Diseñado para durar",
  "No se oxida",
  "Garantía 3 años",
  "+ de 90 colores",
  "Pintura electrostática",
  "Hecho en Colombia",
];

/**
 * Sello editorial minimalista — siguiendo los principios de Emil Kowalski:
 *   - Sin chrome innecesario (no pill cobalt, no shadow agresiva)
 *   - Detalles invisibles que compounden (línea hairline, micro spacing)
 *   - Animación sutil (fade only, 250ms ease-out, sin slide agresivo)
 *   - Tipografía mixta intencional (Bagel para símbolo, Satoshi para copy)
 *   - Beauty as leverage — calm + expensive
 */
export function PremiumBadge() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setI((v) => (v + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-none inline-flex items-center gap-3 text-cobalt">
      {/* Sparkle Bagel rotando muy suave - tipografía como icono */}
      <motion.span
        className="select-none text-xl leading-none text-cobalt/55"
        style={{ fontFamily: "var(--font-bagel)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        aria-hidden
      >
        ✦
      </motion.span>

      {/* Línea vertical hairline */}
      <span
        aria-hidden
        className="block h-3.5 w-px bg-cobalt/25"
      />

      {/* Texto rotando con fade puro (sin slide) */}
      <div className="relative h-4 min-w-[170px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.22em] text-cobalt/85"
            style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
          >
            {MESSAGES[i]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
