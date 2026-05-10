"use client";

import { useState } from "react";
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
  const isPhantom = size === "sm";

  // Si la foto está en /2026/ es una foto real (no placeholder)
  const hasRealPhoto = product.hero.includes("/2026/");

  // Mapping consistente con el filtro: "Aviso de piso/pared/mesa", "Accesorio".
  const CATEGORY_NAME: Record<string, string> = {
    piso: "Aviso de piso",
    pared: "Aviso de pared",
    mesa: "Aviso de mesa",
    accesorio: "Accesorio",
  };
  const categoryName = CATEGORY_NAME[product.category] ?? product.categoryLabel;

  // Nombre corto SIN el prefijo de categoría: "Piso Top Shelf" → "Top Shelf".
  const displayName = product.shortName.replace(/^(Piso|Pared|Mesa)\s+/i, "");

  // Mini-carousel dentro de la card: hero + gallery. Permite pasar imágenes
  // sin tener que entrar al detalle.
  const allImages = [product.hero, ...(product.gallery ?? [])];
  const [imgIndex, setImgIndex] = useState(0);
  const currentImage = allImages[imgIndex] ?? product.hero;
  const hasMultiple = allImages.length > 1;

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i - 1 + allImages.length) % allImages.length);
  };
  const goNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i + 1) % allImages.length);
  };

  // Variante "panini" (sm) — densa, con header + footer estilo coleccionable.
  if (isPhantom) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.02, ease: [0.21, 0.6, 0.35, 1] }}
      >
        <Link
          href={`/avisos/${product.slug}`}
          data-cursor="hover"
          className="group relative block aspect-square overflow-hidden rounded-md border border-cobalt/15 bg-white transition-all hover:z-10 hover:shadow-md"
        >
          {/* HEADER STRIP cobalt — estilo etiqueta panini con código + categoría */}
          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-1 bg-cobalt px-2 py-1 text-cream">
            <span className="text-[8px] font-bold tracking-[0.15em] tabular-nums">
              N°{product.code}
            </span>
            <span className="truncate text-[8px] font-semibold uppercase tracking-[0.15em] opacity-85">
              {categoryName}
            </span>
          </div>

          {/* Badge NUEVO (si aplica) — esquina superior derecha bajo el header */}
          {product.isNew && (
            <span className="absolute right-1.5 top-7 z-20 rounded-sm bg-cream px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider text-cobalt shadow-sm">
              Nuevo
            </span>
          )}

          {/* IMAGEN / PLACEHOLDER — entre header y footer.
              key={imgIndex} fuerza re-render cuando cambia la imagen. */}
          <div className="absolute inset-x-0 top-6 bottom-12 px-3">
            {hasRealPhoto ? (
              <Image
                key={imgIndex}
                src={currentImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 18vw"
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center" style={{ fontFamily: "var(--font-bagel)" }}>
                  <span className="block text-3xl leading-none text-cobalt md:text-4xl">
                    {product.code}
                  </span>
                  <span className="mt-1 block text-[8px] font-medium uppercase tracking-wider text-black/55">
                    {displayName}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* CAROUSEL CONTROLS — flechas left/right (solo si hay >1 imagen).
              Visibles en hover. Click en flechas pasa imagen sin entrar al detalle. */}
          {hasMultiple && hasRealPhoto && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Anterior imagen"
                className="absolute left-1.5 top-1/2 z-30 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-cream/95 text-cobalt opacity-0 shadow-md transition-opacity duration-200 hover:bg-cream group-hover:opacity-100"
              >
                <span className="text-base leading-none">‹</span>
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Siguiente imagen"
                className="absolute right-1.5 top-1/2 z-30 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-cream/95 text-cobalt opacity-0 shadow-md transition-opacity duration-200 hover:bg-cream group-hover:opacity-100"
              >
                <span className="text-base leading-none">›</span>
              </button>

              {/* Dots indicator — encima del footer */}
              <div className="pointer-events-none absolute inset-x-0 bottom-12 z-20 flex justify-center gap-1 pb-1">
                {allImages.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1 w-1 rounded-full transition-colors",
                      i === imgIndex ? "bg-cobalt" : "bg-cobalt/25",
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* FOOTER — nombre del producto en Bagel + precio. Línea fina arriba. */}
          <div className="absolute inset-x-0 bottom-0 z-20 border-t border-cobalt/10 bg-cream-light/70 px-2 py-1.5 backdrop-blur-sm">
            <h3
              className="truncate text-[11px] leading-none text-cobalt"
              style={{ fontFamily: "var(--font-bagel)" }}
            >
              {displayName}
            </h3>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-[10px] font-semibold tabular-nums text-cobalt/75">
                {product.priceLabel}
              </span>
              <span className="text-[10px] text-cobalt/60 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </div>
          </div>

          {/* Hover overlay — sutil para no tapar la imagen (se ve parcial al
              hacer hover). El "Ver →" queda como pista pero las flechas del
              carousel siguen siendo el foco. */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-end bg-cobalt/0 p-2 transition-colors duration-200 group-hover:bg-cobalt/15">
            <span
              className="rounded-sm bg-cobalt/90 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-cream opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            >
              Ver →
            </span>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Variante grande (md/lg) — la original
  const heights = {
    md: "aspect-[3/4]",
    lg: "aspect-[3/4] md:aspect-[3/4]",
  } as const;

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
        className="group block overflow-hidden rounded-3xl bg-white"
      >
        <div className={cn("relative w-full overflow-hidden rounded-3xl border border-black/10 bg-[#f7f7f5] shadow-sm", heights[size as "md" | "lg"])}>
          {hasRealPhoto ? (
            <Image
              src={product.hero}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 400px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white via-white to-white">
              <div className="text-center px-6" style={{ fontFamily: "var(--font-bagel)" }}>
                <span className="block text-7xl leading-none text-cobalt md:text-8xl">
                  {product.code}
                </span>
                <span className="mt-3 block text-sm font-medium uppercase tracking-wider text-black/70">
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
            <p className="text-xs font-medium uppercase tracking-wider text-black/60">
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
              <p className="text-[10px] uppercase tracking-wider text-black/50">desde</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
