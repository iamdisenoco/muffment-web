"use client";

import Image from "next/image";
import { motion } from "motion/react";

const PRODUCTS = [
  { src: "/img/products/2026/cutouts/bent.png", alt: "" },
  { src: "/img/products/2026/cutouts/plegable.png", alt: "" },
  { src: "/img/products/2026/cutouts/plegable-small.png", alt: "" },
  { src: "/img/products/2026/cutouts/ov.png", alt: "" },
  { src: "/img/products/2026/cutouts/luna.png", alt: "" },
  { src: "/img/products/2026/cutouts/flag.png", alt: "" },
];

type Drop = {
  src: string;
  size: number; // px
  startX: number; // % within column
  duration: number; // s
  delay: number; // s
  rotate: number; // degrees rotation (subtle sway)
  opacity: number;
};

// Pre-baked drop configs — random-feeling but deterministic so SSR matches client
const LEFT_DROPS: Drop[] = [
  { src: PRODUCTS[0].src, size: 110, startX: 20, duration: 14, delay: 0,    rotate: -8,  opacity: 1   },
  { src: PRODUCTS[1].src, size: 85,  startX: 60, duration: 12, delay: 2.5,  rotate: 6,   opacity: 0.85 },
  { src: PRODUCTS[2].src, size: 120, startX: 35, duration: 16, delay: 5,    rotate: -4,  opacity: 0.95 },
  { src: PRODUCTS[5].src, size: 75,  startX: 75, duration: 11, delay: 7.5,  rotate: 10,  opacity: 0.8 },
  { src: PRODUCTS[3].src, size: 95,  startX: 50, duration: 13, delay: 10,   rotate: -6,  opacity: 0.9 },
  { src: PRODUCTS[4].src, size: 65,  startX: 12, duration: 10, delay: 1.5,  rotate: 8,   opacity: 0.75 },
];

const RIGHT_DROPS: Drop[] = [
  { src: PRODUCTS[1].src, size: 100, startX: 22, duration: 13, delay: 1,    rotate: 7,   opacity: 0.95 },
  { src: PRODUCTS[3].src, size: 85,  startX: 65, duration: 15, delay: 3.5,  rotate: -8,  opacity: 0.9  },
  { src: PRODUCTS[0].src, size: 115, startX: 40, duration: 17, delay: 6,    rotate: 5,   opacity: 1    },
  { src: PRODUCTS[5].src, size: 80,  startX: 80, duration: 11, delay: 8.5,  rotate: -6,  opacity: 0.8  },
  { src: PRODUCTS[2].src, size: 90,  startX: 28, duration: 14, delay: 11,   rotate: 9,   opacity: 0.85 },
  { src: PRODUCTS[4].src, size: 60,  startX: 55, duration: 9,  delay: 0.5,  rotate: -10, opacity: 0.7  },
];

function Column({ drops, side }: { drops: Drop[]; side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 ${side}-0 z-0 hidden w-[26vw] max-w-[340px] overflow-hidden md:block`}
      style={{
        maskImage:
          side === "left"
            ? "linear-gradient(to right, black 70%, transparent)"
            : "linear-gradient(to left, black 70%, transparent)",
        WebkitMaskImage:
          side === "left"
            ? "linear-gradient(to right, black 70%, transparent)"
            : "linear-gradient(to left, black 70%, transparent)",
      }}
    >
      {drops.map((drop, i) => (
        <motion.div
          key={`${side}-${i}`}
          className="absolute"
          style={{
            left: `${drop.startX}%`,
            width: drop.size,
            height: drop.size,
            opacity: drop.opacity,
          }}
          initial={{ y: "-30vh", rotate: drop.rotate }}
          animate={{ y: "120vh", rotate: drop.rotate * -0.5 }}
          transition={{
            duration: drop.duration,
            delay: drop.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Image
            src={drop.src}
            alt=""
            width={drop.size * 2}
            height={drop.size * 2}
            unoptimized
            className="h-auto w-full select-none"
            draggable={false}
          />
        </motion.div>
      ))}
    </div>
  );
}

export function ProductRain() {
  return (
    <>
      <Column drops={LEFT_DROPS} side="left" />
      <Column drops={RIGHT_DROPS} side="right" />
    </>
  );
}
