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
            className="text-base font-medium uppercase tracking-[0.25em] text-neutral-700 md:text-xl"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {item} <span className="text-cobalt">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
