"use client";

import { motion } from "motion/react";

// Paleta rainbow translúcida — funciona sobre fondos cobalt, cream y blanco.
const COLORS = ["#ff6b35", "#f9c80e", "#06d6a0", "#ef476f", "#4cc9f0", "#3236b7"];

type Pos = {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size: number;
  color: number;
  floatY: number;
  floatDur: number;
  rotDur: number;
  delay: number;
  baseRotate?: number;
};

// IMPORTANTE: todas las figuritas viven SOLO a los lados (left/right ≤ 10%)
// para no chocar con el contenido del centro. Se mueven con el scroll
// (componente absolute dentro del wrapper relative del layout).

const STARS: Pos[] = [
  // Hero (~0-12%)
  { top: "3%", left: "3%", size: 22, color: 0, floatY: 12, floatDur: 4.5, rotDur: 9, delay: 0.4 },
  { top: "7%", right: "4%", size: 28, color: 1, floatY: 14, floatDur: 5.2, rotDur: 11, delay: 0.6 },
  { top: "10%", left: "8%", size: 18, color: 4, floatY: 10, floatDur: 4, rotDur: 8, delay: 0.8 },
  // Categorías (~12-25%)
  { top: "16%", right: "5%", size: 24, color: 2, floatY: 14, floatDur: 5.5, rotDur: 10, delay: 1 },
  { top: "22%", left: "2%", size: 20, color: 3, floatY: 12, floatDur: 4.8, rotDur: 9, delay: 1.2 },
  // FAQ (~25-40%)
  { top: "30%", right: "7%", size: 26, color: 0, floatY: 14, floatDur: 5.3, rotDur: 11, delay: 0.5 },
  { top: "36%", left: "4%", size: 18, color: 5, floatY: 10, floatDur: 4.2, rotDur: 8, delay: 0.7 },
  // Manifiesto (~40-58%)
  { top: "45%", right: "3%", size: 22, color: 1, floatY: 12, floatDur: 4.9, rotDur: 10, delay: 0.6 },
  { top: "52%", left: "5%", size: 26, color: 4, floatY: 14, floatDur: 5.4, rotDur: 11, delay: 0.9 },
  // Clientes (~58-78%)
  { top: "63%", right: "6%", size: 20, color: 2, floatY: 12, floatDur: 4.6, rotDur: 9, delay: 0.4 },
  { top: "72%", left: "3%", size: 24, color: 3, floatY: 14, floatDur: 5.5, rotDur: 11, delay: 0.8 },
  // CTA (~78-100%)
  { top: "82%", right: "7%", size: 22, color: 0, floatY: 12, floatDur: 4.8, rotDur: 9, delay: 0.5 },
  { top: "92%", left: "8%", size: 18, color: 5, floatY: 10, floatDur: 4.2, rotDur: 8, delay: 0.7 },
];

const TRIANGLES: Pos[] = [
  { top: "5%", right: "10%", baseRotate: 0, size: 30, color: 1, floatY: 14, floatDur: 5, rotDur: 14, delay: 0.7 },
  { top: "13%", left: "9%", baseRotate: 90, size: 28, color: 4, floatY: 12, floatDur: 5.2, rotDur: 13, delay: 1 },
  { top: "27%", right: "10%", baseRotate: 180, size: 32, color: 3, floatY: 12, floatDur: 5.3, rotDur: 13, delay: 0.8 },
  { top: "42%", left: "8%", baseRotate: 30, size: 22, color: 0, floatY: 10, floatDur: 4.7, rotDur: 11, delay: 0.6 },
  { top: "58%", right: "9%", baseRotate: 220, size: 28, color: 2, floatY: 12, floatDur: 5, rotDur: 13, delay: 0.9 },
  { top: "75%", left: "10%", baseRotate: 60, size: 24, color: 5, floatY: 12, floatDur: 4.9, rotDur: 12, delay: 0.7 },
  { top: "88%", right: "9%", baseRotate: 120, size: 30, color: 1, floatY: 14, floatDur: 5.3, rotDur: 14, delay: 0.5 },
];

// 3er símbolo: círculos pequeños rellenos (dots) — el más sencillo.
const DOTS: Pos[] = [
  { top: "10%", right: "10%", size: 12, color: 2, floatY: 10, floatDur: 4.2, rotDur: 0, delay: 0.5 },
  { top: "18%", left: "11%", size: 14, color: 3, floatY: 12, floatDur: 4.5, rotDur: 0, delay: 0.7 },
  { top: "33%", left: "9%", size: 10, color: 0, floatY: 8, floatDur: 3.8, rotDur: 0, delay: 0.9 },
  { top: "40%", right: "11%", size: 14, color: 5, floatY: 12, floatDur: 4.6, rotDur: 0, delay: 0.6 },
  { top: "50%", left: "10%", size: 12, color: 1, floatY: 10, floatDur: 4.2, rotDur: 0, delay: 1 },
  { top: "67%", right: "8%", size: 14, color: 4, floatY: 12, floatDur: 4.5, rotDur: 0, delay: 0.8 },
  { top: "80%", left: "9%", size: 10, color: 2, floatY: 8, floatDur: 3.9, rotDur: 0, delay: 0.6 },
  { top: "95%", right: "11%", size: 12, color: 3, floatY: 10, floatDur: 4.3, rotDur: 0, delay: 0.7 },
];

export function FloatingDecorations() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      {STARS.map((pos, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute"
          style={{ top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.55, scale: 1 }}
          transition={{ duration: 0.8, delay: pos.delay, ease: "backOut" }}
        >
          <motion.div
            animate={{ y: [0, -pos.floatY, 0] }}
            transition={{
              duration: pos.floatDur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: pos.delay,
            }}
          >
            <motion.svg
              viewBox="0 0 24 24"
              width={pos.size}
              height={pos.size}
              animate={{ rotate: 360 }}
              transition={{
                duration: pos.rotDur,
                repeat: Infinity,
                ease: "linear",
                delay: pos.delay,
              }}
              style={{ fill: COLORS[pos.color] }}
            >
              <path d="M12 1l2.59 7.41L22 11l-7.41 2.59L12 21l-2.59-7.41L2 11l7.41-2.59L12 1z" />
            </motion.svg>
          </motion.div>
        </motion.div>
      ))}

      {TRIANGLES.map((pos, i) => (
        <motion.div
          key={`tri-${i}`}
          className="absolute"
          style={{ top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.6, delay: pos.delay }}
        >
          <motion.div
            animate={{ y: [0, -pos.floatY, 0] }}
            transition={{
              duration: pos.floatDur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: pos.delay,
            }}
          >
            <motion.svg
              viewBox="0 0 24 24"
              width={pos.size}
              height={pos.size}
              animate={{ rotate: [(pos.baseRotate ?? 0), (pos.baseRotate ?? 0) + 360] }}
              transition={{
                duration: pos.rotDur,
                repeat: Infinity,
                ease: "linear",
                delay: pos.delay,
              }}
              style={{ fill: COLORS[pos.color], transformOrigin: "center" }}
            >
              <path d="M12 2L2 22h20L12 2z" />
            </motion.svg>
          </motion.div>
        </motion.div>
      ))}

      {DOTS.map((pos, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute"
          style={{ top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.55, scale: 1 }}
          transition={{ duration: 0.7, delay: pos.delay, ease: "backOut" }}
        >
          <motion.div
            animate={{ y: [0, -pos.floatY, 0] }}
            transition={{
              duration: pos.floatDur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: pos.delay,
            }}
          >
            <span
              style={{
                display: "block",
                width: pos.size,
                height: pos.size,
                borderRadius: "9999px",
                background: COLORS[pos.color],
              }}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
