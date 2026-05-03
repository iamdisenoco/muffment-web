"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  size = "md",
  index = 0,
}: {
  product: Product;
  size?: "sm" | "md" | "lg";
  index?: number;
}) {
  const heights = {
    sm: "aspect-[4/5]",
    md: "aspect-[3/4]",
    lg: "aspect-[4/5] md:aspect-[5/6]",
  } as const;

  // Si la foto está en /2026/ es una foto real (no placeholder)
  const hasRealPhoto = product.hero.includes("/2026/");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.21, 0.6, 0.35, 1] }}
    >
      <Link
        href={`/avisos/${product.slug}`}
        data-cursor="hover"
        className="group block overflow-hidden rounded-2xl bg-cream-light"
      >
        <div className={cn("relative w-full overflow-hidden", heights[size])}>
          {hasRealPhoto ? (
            <Image
              src={product.hero}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 400px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            /* Placeholder con código + nombre cuando aún no hay foto real */
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cream-light via-cream to-cream-dark">
              <div
                className="text-center px-6"
                style={{ fontFamily: "var(--font-bagel)" }}
              >
                <span className="block text-7xl leading-none text-cobalt md:text-8xl">
                  {product.code}
                </span>
                <span className="mt-3 block text-sm font-medium uppercase tracking-wider text-cobalt/70">
                  {product.shortName}
                </span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-cobalt opacity-0 transition-opacity duration-300 group-hover:opacity-90" />
          <div className="pointer-events-none absolute inset-0 flex items-end p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="text-cream text-sm font-medium uppercase tracking-wider">
              Ver producto →
            </span>
          </div>
        </div>
        <div className="flex items-end justify-between gap-4 px-1 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-cobalt/60">
              {product.categoryLabel}
            </p>
            <h3 className="mt-1 text-lg font-medium text-cobalt">
              {product.name}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-lg font-medium text-cobalt">
              {product.priceLabel}
            </span>
            {product.priceEstimated && (
              <p className="text-[10px] uppercase tracking-wider text-cobalt/50">desde</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
