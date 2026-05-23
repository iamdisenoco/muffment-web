"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";

const IridescentOrb = dynamic(
  () => import("./IridescentOrb").then((m) => m.IridescentOrb),
  { ssr: false },
);

const MESSAGES = [
  "Diseñado para durar",
  "No se oxida",
  "Garantía 3 años",
  "+ de 90 colores",
  "Pintura electrostática",
  "Hecho en Colombia",
];

/**
 * Premium Badge V2 — Starry Labs inspired.
 * Iridescent 3D orb (R3F + custom shader) + rotating spec text.
 * Reemplaza el viejo ✦ Bagel por algo que se siente caro de verdad.
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
    <div className="pointer-events-none inline-flex items-center gap-3 text-cobalt">
      {/* Iridescent orb 3D */}
      <IridescentOrb size={32} className="shrink-0" />

      {/* Línea vertical hairline */}
      <span aria-hidden className="block h-3.5 w-px bg-cobalt/25" />

      {/* Texto rotando con fade puro */}
      <div className="relative h-4 min-w-[180px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
