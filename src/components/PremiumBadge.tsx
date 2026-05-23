"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const MESSAGES = [
  "Diseñado para durar",
  "No se oxida",
  "Garantía 3 años",
  "+ de 90 colores",
  "Pintura electrostática",
  "Hecho en Colombia",
];

/**
 * Sello premium MUFFMENT - pill cobalt sólido con sparkle amarillo
 * giratorio. Más distintivo que un border outline.
 */
export function PremiumBadge() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setI((v) => (v + 1) % MESSAGES.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="pointer-events-none inline-flex h-11 items-center gap-3 rounded-full bg-cobalt pl-3 pr-5 shadow-[0_8px_24px_rgba(50,54,183,0.28)]"
    >
      {/* Sparkle amarillo giratorio - color acento MUFFMENT */}
      <motion.div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f9c80e]"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
          <path
            d="M12 2 L13.4 10.6 L22 12 L13.4 13.4 L12 22 L10.6 13.4 L2 12 L10.6 10.6 Z"
            fill="#3236b7"
          />
        </svg>
      </motion.div>

      {/* Texto rotando - whitespace-nowrap evita corte */}
      <div className="relative h-5 min-w-[160px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.21, 0.6, 0.35, 1] }}
            className="absolute inset-0 flex items-center whitespace-nowrap text-xs font-semibold uppercase tracking-[0.18em] text-cream"
            style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
          >
            {MESSAGES[i]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
