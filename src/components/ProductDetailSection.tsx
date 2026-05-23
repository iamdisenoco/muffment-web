"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ColorPicker } from "./ColorPicker";
import { AddToCartButton } from "./AddToCartButton";
import { WhatsAppButton } from "./WhatsAppButton";
import { PremiumBadge } from "./PremiumBadge";
import type { Product } from "@/data/products";
import type { Color } from "@/data/colors";
import { cn } from "@/lib/utils";

type Props = {
  product: Product;
  colorPrefix?: string;
};

/**
 * Detalle de producto en una sola vista (above the fold):
 *   col-3 INFO IZQUIERDA: precio + descripción corta + CTA + meta
 *   col-6 FOTO CENTRO: foto gigante con flechas (sin cuadro)
 *   col-3 COLORES DERECHA: picker compacto 11-col + tooltip mini
 *
 * Debajo, secciones de specs adicionales solo para profundizar.
 */
export function ProductDetailSection({ product, colorPrefix }: Props) {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [imgIdx, setImgIdx] = useState(0);

  const dynamicHero =
    colorPrefix && selectedColor
      ? `/img/products/colors/${colorPrefix}-${selectedColor.id}.jpg`
      : product.hero;

  const images = [dynamicHero, ...(product.gallery ?? [])];
  const currentImg = images[imgIdx] ?? dynamicHero;
  const hasMultiple = images.length > 1;

  const message = `Hola MUFFMENT, quiero el ${product.name}${selectedColor ? ` en color ${selectedColor.name}` : ""} (${product.priceLabel}). ¿Me ayudas con la cotización?`;

  const monoStyle = { fontFamily: '"Satoshi", system-ui, sans-serif' };
  const displayStyle = { fontFamily: "var(--font-bagel)" };

  const goPrev = () =>
    setImgIdx((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setImgIdx((i) => (i + 1) % images.length);

  return (
    <article className="bg-white">
      {/* ═══════════ HERO STAGE - todo en una vista ═══════════ */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-[1700px] px-6 pb-10 md:px-12 md:pb-16">
          {/* Eyebrow + nombre real centrado */}
          <div className="relative z-10 mb-6 text-center md:mb-8">
            <p
              className="text-[10px] uppercase tracking-[0.35em] text-cobalt/60"
              style={monoStyle}
            >
              {product.categoryLabel} · N°{product.code}
            </p>
            <h2
              className="mt-1.5 text-[clamp(1.5rem,3vw,2.5rem)] leading-none tracking-tight text-cobalt"
              style={displayStyle}
            >
              {product.name}
            </h2>
          </div>

          {/* GRID 3-COL: info izq · foto centro · colores derecha */}
          <div className="grid items-center gap-6 md:grid-cols-12 md:gap-x-6">
            {/* ────── IZQUIERDA (col-3): precio + descripción + CTA ────── */}
            <div className="md:col-span-3">
              <p
                className="text-[10px] uppercase tracking-[0.3em] text-cobalt/55"
                style={monoStyle}
              >
                Valor
              </p>
              <p
                className="mt-1 text-4xl text-cobalt tabular-nums md:text-5xl"
                style={displayStyle}
              >
                {product.priceLabel}
              </p>
              {product.priceEstimated && (
                <p
                  className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-cobalt/55"
                  style={monoStyle}
                >
                  desde · final según diseño
                </p>
              )}

              <p className="mt-5 text-sm leading-relaxed text-cobalt/75 md:text-[15px]">
                {product.description}
              </p>

              {selectedColor && (
                <div className="mt-4 flex items-center gap-2">
                  <span
                    aria-hidden
                    className="block h-7 w-7 shrink-0 rounded-full border border-cobalt/10 shadow-sm"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <div>
                    <p
                      className="text-[8px] uppercase tracking-[0.25em] text-cobalt/55"
                      style={monoStyle}
                    >
                      Color
                    </p>
                    <p
                      className="text-sm text-cobalt"
                      style={displayStyle}
                    >
                      {selectedColor.name}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-2.5">
                <AddToCartButton
                  product={product}
                  selectedColor={selectedColor}
                />
                <WhatsAppButton message={message} size="lg">
                  Preguntar
                </WhatsAppButton>
              </div>

              <div
                className="mt-5 flex flex-col gap-1 text-[10px] uppercase tracking-[0.22em] text-cobalt/55"
                style={monoStyle}
              >
                <span className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-cobalt/45" />
                  Bajo pedido · 4 sem
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-cobalt/45" />
                  Garantía 3 años
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-cobalt/45" />
                  Hecho en Colombia
                </span>
              </div>
            </div>

            {/* ────── CENTRO (col-6): FOTO GIGANTE ────── */}
            <div className={cn("relative", colorPrefix ? "md:col-span-6" : "md:col-span-9")}>
              {/* Premium badge flotante esquina sup-derecha del stage */}
              <div className="absolute right-0 top-0 z-30 hidden md:block">
                <PremiumBadge />
              </div>

              <div className="relative mx-auto flex items-center justify-center">
                {hasMultiple && (
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Anterior"
                    data-cursor="hover"
                    className="absolute -left-4 z-20 flex h-14 w-14 items-center justify-center text-cobalt/55 transition-all hover:scale-110 hover:text-cobalt md:-left-6"
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                )}

                <div className="relative aspect-square w-full max-w-[560px] md:aspect-[5/4] md:max-w-[720px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImg}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.4, ease: [0.21, 0.6, 0.35, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={currentImg}
                        alt={product.name}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 720px"
                        className="object-contain"
                        style={{
                          mixBlendMode: "multiply",
                          filter:
                            "drop-shadow(0 25px 35px rgba(50,54,183,0.12))",
                        }}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {hasMultiple && (
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Siguiente"
                    data-cursor="hover"
                    className="absolute -right-4 z-20 flex h-14 w-14 items-center justify-center text-cobalt/55 transition-all hover:scale-110 hover:text-cobalt md:-right-6"
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Dots */}
              {hasMultiple && (
                <div className="mt-5 flex items-center justify-center gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Imagen ${i + 1}`}
                      onClick={() => setImgIdx(i)}
                      data-cursor="hover"
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        i === imgIdx
                          ? "w-6 bg-cobalt"
                          : "w-1.5 bg-cobalt/30 hover:bg-cobalt/55",
                      )}
                    />
                  ))}
                </div>
              )}

              {/* Premium badge inline en mobile (en desktop va arriba absolute) */}
              <div className="mt-5 flex justify-center md:hidden">
                <PremiumBadge />
              </div>
            </div>

            {/* ────── DERECHA (col-3): COLOR PICKER COMPACTO ────── */}
            {colorPrefix && (
              <div className="md:col-span-3">
                <p
                  className="text-[10px] uppercase tracking-[0.3em] text-cobalt/55"
                  style={monoStyle}
                >
                  Escogé tu color
                </p>
                <p
                  className="mt-0.5 mb-4 text-[11px] text-cobalt/60"
                  style={monoStyle}
                >
                  + de 90 colores · pintura electrostática
                </p>
                <ColorPicker
                  selectedId={selectedColor?.id ?? null}
                  onSelect={setSelectedColor}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ SPECS (debajo, para profundizar) ═══════════ */}
      <section className="mx-auto max-w-[1600px] px-6 pb-20 md:px-12 md:pb-28 md:pt-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-12">
          <Spec label="Dimensiones" value={product.totalSize} />
          <Spec label="Área del arte" value={product.artSize} />
          <Spec label="Materiales" value={product.materials} />
          <Spec label="Pintura" value={product.paint} />
        </div>

        {product.notes && (
          <p className="mt-8 max-w-[60ch] text-xs leading-relaxed text-cobalt/65">
            <span
              className="mr-2 text-[9px] uppercase tracking-[0.3em] text-cobalt/45"
              style={monoStyle}
            >
              Nota
            </span>
            {product.notes}
          </p>
        )}
      </section>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        className="mb-2 text-[9px] uppercase tracking-[0.3em] text-cobalt/50"
        style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
      >
        {label}
      </p>
      <p className="text-sm leading-snug text-cobalt md:text-base">{value}</p>
    </div>
  );
}
