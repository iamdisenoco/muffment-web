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
 * Sello premium minimal - sparkle giratorio + mensaje rotando.
 * Diseño limpio sin emoji redundante.
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
    <div className="pointer-events-none inline-flex items-center gap-4 rounded-full border border-cobalt/15 bg-white/60 px-5 py-2.5 backdrop-blur-sm">
      {/* Sparkle giratorio - estrella sutil 4 puntas */}
      <motion.svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="shrink-0 text-cobalt"
        aria-hidden
      >
        <path
          d="M12 2 L13 11 L22 12 L13 13 L12 22 L11 13 L2 12 L11 11 Z"
          fill="currentColor"
        />
      </motion.svg>

      {/* Línea separadora */}
      <span aria-hidden className="h-3 w-px bg-cobalt/25" />

      {/* Texto que rota */}
      <div className="relative h-5 min-w-[180px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.21, 0.6, 0.35, 1] }}
            className="absolute inset-0 text-xs font-medium uppercase tracking-[0.18em] text-cobalt"
            style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
          >
            {MESSAGES[i]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
