"use client";

import { motion } from "motion/react";

export function Marquee({
  items,
  speed = 40,
}: {
  items: string[];
  speed?: number;
}) {
  // Duplicamos para loop continuo
  const list = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y border-black/10 bg-white py-6">
      <motion.div
        className="flex shrink-0 gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {list.map((item, i) => (
          <span
            key={i}
            className="text-3xl uppercase tracking-tight text-cobalt md:text-5xl"
            style={{ fontFamily: "var(--font-bagel)" }}
          >
            {item} ✦
          </span>
        ))}
      </motion.div>
    </div>
  );
}
