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
 * Detalle de producto - integrado, foto gigante + color picker al lado
 * (no debajo), bg blanco puro sin cuadrículas.
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
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HERO STAGE - foto gigante centrada + color picker AL LADO
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-[1700px] px-6 pb-12 md:px-12 md:pb-20">
          {/* Eyebrow + título compacto centrado arriba */}
          <div className="relative z-10 mb-6 text-center md:mb-8">
            <p
              className="text-[10px] uppercase tracking-[0.35em] text-cobalt/60"
              style={monoStyle}
            >
              {product.categoryLabel} · N°{product.code}
            </p>
            <h2
              className="mt-2 text-[clamp(1.5rem,3vw,2.5rem)] leading-none tracking-tight text-cobalt"
              style={displayStyle}
            >
              {product.name}
            </h2>
          </div>

          {/* LAYOUT HERO: foto centro-izq grande + color picker derecha */}
          <div className="grid items-center gap-8 md:grid-cols-12 md:gap-x-8">
            {/* IZQUIERDA: Stage con nombre detrás + foto + flechas */}
            <div className={cn("relative", colorPrefix ? "md:col-span-8" : "md:col-span-12")}>
              {/* Nombre Bagel GIGANTE detrás (decorativo) */}
              <h1
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none whitespace-nowrap text-center text-cobalt/[0.06]"
                style={{
                  ...displayStyle,
                  fontSize: "clamp(3rem, 14vw, 14rem)",
                  lineHeight: 0.85,
                  letterSpacing: "-0.02em",
                }}
              >
                {product.shortName}
              </h1>

              {/* Foto GIGANTE - sin cuadro, sin border, sin bg */}
              <div className="relative z-10 mx-auto flex items-center justify-center">
                {hasMultiple && (
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Anterior"
                    data-cursor="hover"
                    className="absolute left-0 z-20 flex h-16 w-16 items-center justify-center text-cobalt/55 transition-all hover:scale-110 hover:text-cobalt"
                  >
                    <svg
                      width="36"
                      height="36"
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

                <div className="relative aspect-square w-full max-w-[640px] md:aspect-[5/4] md:max-w-[760px]">
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
                        sizes="(max-width: 768px) 100vw, 760px"
                        className="object-contain"
                        style={{
                          mixBlendMode: "multiply",
                          filter:
                            "drop-shadow(0 30px 40px rgba(50,54,183,0.12))",
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
                    className="absolute right-0 z-20 flex h-16 w-16 items-center justify-center text-cobalt/55 transition-all hover:scale-110 hover:text-cobalt"
                  >
                    <svg
                      width="36"
                      height="36"
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

              {/* Dots indicator */}
              {hasMultiple && (
                <div className="relative z-10 mt-6 flex items-center justify-center gap-2">
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
                          ? "w-8 bg-cobalt"
                          : "w-1.5 bg-cobalt/30 hover:bg-cobalt/55",
                      )}
                    />
                  ))}
                </div>
              )}

              {/* Premium badge - debajo de la galería, centered */}
              <div className="relative z-10 mt-6 flex justify-center">
                <PremiumBadge />
              </div>
            </div>

            {/* DERECHA: Color picker como sidebar etéreo (sin borders) */}
            {colorPrefix && (
              <div className="md:col-span-4">
                <div className="md:sticky md:top-32">
                  <p
                    className="text-[10px] uppercase tracking-[0.3em] text-cobalt/55"
                    style={monoStyle}
                  >
                    Escogé tu color
                  </p>
                  <p
                    className="mt-1 text-sm text-cobalt/70"
                    style={monoStyle}
                  >
                    88 colores ZMK · pintura electrostática
                  </p>
                  <div className="mt-5">
                    <ColorPicker
                      selectedId={selectedColor?.id ?? null}
                      onSelect={setSelectedColor}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          INFO + SPECS + CTA
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="mx-auto max-w-[1600px] px-6 pb-20 md:px-12 md:pb-28">
        <div className="grid gap-12 md:grid-cols-12 md:gap-x-16">
          {/* IZQUIERDA: descripción + specs en flujo */}
          <div className="md:col-span-7">
            <p className="max-w-[55ch] text-base leading-relaxed text-cobalt/80 md:text-lg">
              {product.description}
            </p>

            {/* Specs en grid 4-col sin borders, solo spacing */}
            <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-8">
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
          </div>

          {/* DERECHA: precio + color seleccionado + CTA */}
          <div className="md:col-span-5">
            <div className="md:sticky md:top-32">
              <p
                className="text-[10px] uppercase tracking-[0.3em] text-cobalt/55"
                style={monoStyle}
              >
                Valor
              </p>
              <p
                className="mt-1 text-5xl text-cobalt tabular-nums md:text-6xl"
                style={displayStyle}
              >
                {product.priceLabel}
              </p>
              {product.priceEstimated && (
                <p
                  className="mt-1 text-[9px] uppercase tracking-[0.2em] text-cobalt/55"
                  style={monoStyle}
                >
                  desde · final según diseño
                </p>
              )}

              {selectedColor && (
                <div className="mt-6 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="block h-10 w-10 shrink-0 rounded-full border border-cobalt/10 shadow-sm"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <div>
                    <p
                      className="text-[9px] uppercase tracking-[0.25em] text-cobalt/55"
                      style={monoStyle}
                    >
                      Color seleccionado
                    </p>
                    <p className="text-base text-cobalt" style={displayStyle}>
                      {selectedColor.name}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-8 space-y-3">
                <AddToCartButton
                  product={product}
                  selectedColor={selectedColor}
                />
                <WhatsAppButton message={message} size="lg">
                  Preguntar por WhatsApp
                </WhatsAppButton>
              </div>

              <div
                className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] uppercase tracking-[0.25em] text-cobalt/55"
                style={monoStyle}
              >
                <span>Bajo pedido · 4 sem</span>
                <span aria-hidden className="text-cobalt/25">·</span>
                <span>Garantía 3 años</span>
                <span aria-hidden className="text-cobalt/25">·</span>
                <span>Hecho en Colombia</span>
              </div>
            </div>
          </div>
        </div>
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
