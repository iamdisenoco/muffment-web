"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/data/products";
import type { Color } from "@/data/colors";
import { cn } from "@/lib/utils";

type Props = {
  product: Product;
  selectedColor?: Color | null;
};

/**
 * Add to Cart con magnetismo (awwwards-style) — el botón "se atrae" hacia
 * el cursor cuando se acerca. Además:
 *   - Halo iridiscente cobalt + sombra cinematográfica
 *   - Micro-feedback verde al agregar
 *   - El texto interno se mueve sutilmente independiente del botón para
 *     dar sensación de profundidad parallax
 */
export function AddToCartButton({ product, selectedColor }: Props) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - r.left - r.width / 2) * 0.25,
      y: (e.clientY - r.top - r.height / 2) * 0.4,
    });
  };
  const handleLeave = () => setPos({ x: 0, y: 0 });

  const handleClick = () => {
    add({
      slug: product.slug,
      code: product.code,
      name: product.name,
      shortName: product.shortName,
      priceLabel: product.priceLabel,
      price: product.price,
      hero: product.hero,
      shippingSize: product.shippingSize,
      color: selectedColor
        ? { id: selectedColor.id, name: selectedColor.name, hex: selectedColor.hex }
        : undefined,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const springTransition = {
    type: "spring" as const,
    stiffness: 200,
    damping: 18,
    mass: 0.6,
  };

  return (
    <motion.button
      ref={btnRef}
      type="button"
      onClick={handleClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor="hover"
      animate={pos}
      transition={springTransition}
      className={cn(
        "relative w-full overflow-hidden rounded-full px-6 py-4 text-base font-semibold uppercase tracking-wider md:text-lg",
        justAdded
          ? "bg-[#06d6a0] text-cobalt"
          : "bg-cobalt text-cream",
      )}
      style={{
        boxShadow: justAdded
          ? "0 8px 28px -8px rgba(6,214,160,0.55)"
          : "0 14px 38px -10px rgba(50,54,183,0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
      }}
    >
      {/* Halo iridiscente que sigue al cursor (sutil) */}
      {!justAdded && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0"
          animate={{ opacity: pos.x !== 0 || pos.y !== 0 ? 0.5 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background:
              "radial-gradient(120px circle at var(--mx,50%) var(--my,50%), rgba(255,107,53,0.35), rgba(6,214,160,0.2) 40%, transparent 70%)",
          }}
        />
      )}

      {/* Texto con parallax interno (se mueve más que el botón) */}
      <motion.span
        className="relative z-10 inline-block"
        animate={{ x: pos.x * 0.5, y: pos.y * 0.5 }}
        transition={springTransition}
      >
        {justAdded ? "✓ Agregado al carrito" : "Agregar al carrito"}
      </motion.span>
    </motion.button>
  );
}
