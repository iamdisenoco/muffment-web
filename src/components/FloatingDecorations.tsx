"use client";

import { motion } from "motion/react";

// Paleta rainbow translúcida — funciona sobre fondos cobalt, cream y blanco.
const COLORS = ["#ff6b35", "#f9c80e", "#06d6a0", "#ef476f", "#4cc9f0", "#3236b7"];

const STARS: Array<{
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
}> = [
  { top: "8%", left: "4%", size: 22, color: 0, floatY: 12, floatDur: 4.5, rotDur: 9, delay: 0.4 },
  { top: "16%", right: "5%", size: 28, color: 1, floatY: 14, floatDur: 5.2, rotDur: 11, delay: 0.6 },
  { top: "30%", left: "7%", size: 18, color: 2, floatY: 10, floatDur: 4, rotDur: 8, delay: 0.8 },
  { top: "44%", right: "4%", size: 24, color: 3, floatY: 14, floatDur: 5.5, rotDur: 10, delay: 1 },
  { top: "58%", left: "5%", size: 20, color: 4, floatY: 12, floatDur: 4.8, rotDur: 9, delay: 1.2 },
  { top: "72%", right: "7%", size: 26, color: 0, floatY: 14, floatDur: 5.3, rotDur: 11, delay: 1.4 },
  { top: "86%", left: "9%", size: 18, color: 2, floatY: 10, floatDur: 4.2, rotDur: 8, delay: 1.6 },
];

const TRIANGLES: Array<{
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size: number;
  baseRotate: number;
  color: number;
  floatY: number;
  floatDur: number;
  rotDur: number;
  delay: number;
}> = [
  { top: "22%", left: "12%", baseRotate: 0, size: 30, color: 1, floatY: 14, floatDur: 5, rotDur: 14, delay: 0.7 },
  { top: "50%", right: "12%", baseRotate: 90, size: 32, color: 4, floatY: 10, floatDur: 4.5, rotDur: 12, delay: 0.9 },
  { top: "80%", right: "15%", baseRotate: 180, size: 28, color: 3, floatY: 12, floatDur: 5.3, rotDur: 13, delay: 1.1 },
  { top: "12%", left: "45%", baseRotate: 30, size: 22, color: 5, floatY: 10, floatDur: 4.7, rotDur: 11, delay: 1.3 },
];

export function FloatingDecorations() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      {STARS.map((pos, i) => (
        <motion.div
          key={`gstar-${i}`}
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
          key={`gtri-${i}`}
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
              animate={{ rotate: [pos.baseRotate, pos.baseRotate + 360] }}
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
    </div>
  );
}
