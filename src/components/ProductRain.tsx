"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

type ProductMeta = { src: string; slug: string; name: string };
const PRODUCTS: ProductMeta[] = [
  { src: "/img/products/2026/cutouts/bent.png",            slug: "hablador-piso-bent",          name: "Hablador de Piso BENT" },
  { src: "/img/products/2026/cutouts/plegable.png",        slug: "hablador-piso-plegable",      name: "Hablador de Piso Plegable" },
  { src: "/img/products/2026/cutouts/plegable-small.png",  slug: "hablador-piso-plegable-small", name: "Hablador de Piso Plegable small" },
  { src: "/img/products/2026/cutouts/ov.png",              slug: "hablador-piso-ov",            name: "Hablador de Piso OV" },
  { src: "/img/products/2026/cutouts/luna.png",            slug: "hablador-pared-luna",         name: "Hablador de Pared LUNA" },
  { src: "/img/products/2026/cutouts/flag.png",            slug: "hablador-pared-flag",         name: "Aviso de Pared FLAG" },
  { src: "/img/products/2026/cutouts/top-shelf.png",       slug: "hablador-piso-top-shelf",     name: "Hablador de Piso TOP SHELF" },
  { src: "/img/products/2026/cutouts/paleta-redondo.png",  slug: "hablador-piso-paleta-redondo", name: "Paleta Redondo" },
];

type Drop = {
  product: ProductMeta;
  size: number; // px
  startX: number; // % within column
  duration: number; // s
  delay: number; // s
  rotate: number; // degrees rotation (subtle sway)
  opacity: number;
};

// Pre-baked drop configs — staggered with NEGATIVE delays so all drops are
// already on screen at first paint (no empty side at startup).
const LEFT_DROPS: Drop[] = [
  { product: PRODUCTS[0], size: 110, startX: 20, duration: 14, delay: 0,     rotate: -8,  opacity: 1   },
  { product: PRODUCTS[1], size: 85,  startX: 60, duration: 12, delay: -3,    rotate: 6,   opacity: 0.85 },
  { product: PRODUCTS[2], size: 120, startX: 35, duration: 16, delay: -6,    rotate: -4,  opacity: 0.95 },
  { product: PRODUCTS[5], size: 75,  startX: 75, duration: 11, delay: -8,    rotate: 10,  opacity: 0.8 },
  { product: PRODUCTS[3], size: 95,  startX: 50, duration: 13, delay: -2,    rotate: -6,  opacity: 0.9 },
  { product: PRODUCTS[4], size: 65,  startX: 12, duration: 10, delay: -5,    rotate: 8,   opacity: 0.75 },
  { product: PRODUCTS[6], size: 70,  startX: 30, duration: 15, delay: -10,   rotate: 4,   opacity: 0.9  },
  { product: PRODUCTS[7], size: 105, startX: 18, duration: 13, delay: -4.5,  rotate: -7,  opacity: 0.95 },
];

const RIGHT_DROPS: Drop[] = [
  { product: PRODUCTS[1], size: 100, startX: 22, duration: 13, delay: -1,    rotate: 7,   opacity: 0.95 },
  { product: PRODUCTS[3], size: 85,  startX: 65, duration: 15, delay: -4,    rotate: -8,  opacity: 0.9  },
  { product: PRODUCTS[0], size: 115, startX: 40, duration: 17, delay: -7,    rotate: 5,   opacity: 1    },
  { product: PRODUCTS[5], size: 80,  startX: 80, duration: 11, delay: -9,    rotate: -6,  opacity: 0.8  },
  { product: PRODUCTS[2], size: 90,  startX: 28, duration: 14, delay: -11,   rotate: 9,   opacity: 0.85 },
  { product: PRODUCTS[4], size: 60,  startX: 55, duration: 9,  delay: -2.5,  rotate: -10, opacity: 0.7  },
  { product: PRODUCTS[6], size: 110, startX: 70, duration: 16, delay: -13,   rotate: -5,  opacity: 0.95 },
  { product: PRODUCTS[7], size: 95,  startX: 45, duration: 12, delay: -6,    rotate: 8,   opacity: 0.9  },
];

function Column({ drops, side }: { drops: Drop[]; side: "left" | "right" }) {
  // Static classes so Tailwind always includes both left-0 and right-0
  const sideClass = side === "left" ? "left-0" : "right-0";
  const maskGradient =
    side === "left"
      ? "linear-gradient(to right, black 70%, transparent)"
      : "linear-gradient(to left, black 70%, transparent)";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 ${sideClass} z-0 hidden w-[26vw] max-w-[340px] overflow-hidden md:block`}
      style={{
        maskImage: maskGradient,
        WebkitMaskImage: maskGradient,
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
          {/* Click → ir a la página del producto. pointer-events-auto vuelve
              a habilitar el click solo sobre el producto (no sobre área vacía
              de la columna). */}
          <Link
            href={`/avisos/${drop.product.slug}`}
            data-cursor="hover"
            aria-label={drop.product.name}
            className="pointer-events-auto block transition-transform hover:scale-110"
          >
            <Image
              src={drop.product.src}
              alt={drop.product.name}
              width={drop.size * 2}
              height={drop.size * 2}
              unoptimized
              className="h-auto w-full select-none"
              draggable={false}
            />
          </Link>
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
