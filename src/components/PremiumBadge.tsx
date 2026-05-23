"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const MESSAGES = [
  { star: "✦", text: "Diseñado para durar" },
  { star: "✦", text: "Acero galvanizado · No se oxida" },
  { star: "✦", text: "Garantía 3 años" },
  { star: "✦", text: "Pintura electrostática" },
  { star: "✦", text: "Hecho en Colombia" },
];

/**
 * Sello premium flotante - estrella giratoria + mensaje que rota
 * entre 5 bondades del producto cada 3.5s. Diseño tipo medalla.
 */
export function PremiumBadge() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setI((v) => (v + 1) % MESSAGES.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const m = MESSAGES[i];

  return (
    <div className="pointer-events-none flex items-center gap-3">
      {/* Estrella giratoria */}
      <motion.svg
        width="48"
        height="48"
        viewBox="0 0 100 100"
        className="md:h-14 md:w-14"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <g fill="currentColor" className="text-cobalt">
          {/* Estrella de 8 puntas tipo medalla MUFFMENT */}
          <path d="M50 5 L54 46 L95 50 L54 54 L50 95 L46 54 L5 50 L46 46 Z" />
          <circle cx="50" cy="50" r="4" />
        </g>
      </motion.svg>

      {/* Texto que rota */}
      <div className="relative h-6 min-w-[170px] overflow-hidden md:h-7 md:min-w-[210px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.21, 0.6, 0.35, 1] }}
            className="absolute inset-0 text-sm font-medium uppercase tracking-[0.18em] text-cobalt md:text-[15px]"
            style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
          >
            <span className="mr-1.5 opacity-60">{m.star}</span>
            {m.text}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
