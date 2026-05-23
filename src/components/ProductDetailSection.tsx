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
 * Detalle de producto - estetica imponente, integrada, premium.
 *
 * Layout:
 *   1. HERO STAGE: nombre Bagel GIGANTE detras (z-0, semi-transparente),
 *      foto del producto encima centrada (z-10) MUY grande, flechas
 *      navegacion eteres a los lados (no encapsuladas). Badge premium
 *      flotante con mensaje rotando.
 *   2. COLOR PICKER directo abajo del hero (no en una seccion separada).
 *   3. INFO PANEL integrado sin borders: precio + descripcion + CTA + specs.
 */
export function ProductDetailSection({ product, colorPrefix }: Props) {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [imgIdx, setImgIdx] = useState(0);

  const dynamicHero =
    colorPrefix && selectedColor
      ? `/img/products/colors/${colorPrefix}-${selectedColor.id}.jpg`
      : product.hero;

  // Galeria: hero dinamico (depende de color) + gallery del producto
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
    <article>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HERO STAGE - foto gigante centrada, nombre detras
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(232,226,209,0.4) 0%, white 60%)",
        }}
      >
        <div className="relative mx-auto max-w-[1600px] px-6 py-12 md:px-12 md:pt-16 md:pb-20">
          {/* Premium badge top-right */}
          <div className="absolute right-6 top-12 z-30 hidden md:block md:right-12 md:top-16">
            <PremiumBadge />
          </div>

          {/* Premium badge mobile - inline arriba */}
          <div className="mb-6 md:hidden">
            <PremiumBadge />
          </div>

          {/* STAGE: nombre detrás + foto adelante */}
          <div className="relative">
            {/* Nombre del producto GIGANTE detrás (decorativo) */}
            <h1
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-[55%] select-none whitespace-nowrap text-center text-cobalt/[0.07] md:text-cobalt/[0.06]"
              style={{
                ...displayStyle,
                fontSize: "clamp(3.5rem, 16vw, 17rem)",
                lineHeight: 0.85,
                letterSpacing: "-0.02em",
              }}
            >
              {product.shortName}
            </h1>

            {/* Nombre real del producto (accesible) - inline arriba pequeño */}
            <div className="relative z-10 mb-4 text-center">
              <p
                className="text-[11px] uppercase tracking-[0.35em] text-cobalt/65"
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

            {/* IMAGEN GIGANTE + FLECHAS */}
            <div className="relative z-10 mx-auto flex items-center justify-center">
              {/* Flecha izquierda - ETÉREA, sin contenedor */}
              {hasMultiple && (
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Anterior"
                  data-cursor="hover"
                  className="group/arrow absolute left-0 z-20 flex h-16 w-16 items-center justify-center text-cobalt/60 transition-all hover:scale-110 hover:text-cobalt md:left-2"
                >
                  <svg
                    width="40"
                    height="40"
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

              {/* La foto, sin caja, GRANDE */}
              <div className="relative aspect-square w-full max-w-[680px] md:aspect-[5/4] md:max-w-[820px]">
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
                      sizes="(max-width: 768px) 100vw, 820px"
                      className="object-contain drop-shadow-[0_30px_50px_rgba(50,54,183,0.18)]"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Flecha derecha */}
              {hasMultiple && (
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Siguiente"
                  data-cursor="hover"
                  className="group/arrow absolute right-0 z-20 flex h-16 w-16 items-center justify-center text-cobalt/60 transition-all hover:scale-110 hover:text-cobalt md:right-2"
                >
                  <svg
                    width="40"
                    height="40"
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

            {/* Dots indicador */}
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
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          COLOR PICKER (primero, antes que specs)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {colorPrefix && (
        <section className="mx-auto max-w-[1600px] px-6 pb-16 md:px-12 md:pb-20">
          <div className="grid gap-10 md:grid-cols-12 md:gap-x-16">
            <div className="md:col-span-7">
              <p
                className="mb-1 text-[10px] uppercase tracking-[0.3em] text-cobalt/55"
                style={monoStyle}
              >
                Personalizá · 88 colores ZMK
              </p>
              <h3
                className="text-2xl text-cobalt md:text-3xl"
                style={displayStyle}
              >
                Escogé tu color
              </h3>
              <p className="mt-4 max-w-[50ch] text-sm leading-relaxed text-cobalt/70 md:text-base">
                Pintura electrostática en polvo aplicada y horneada. Pasá el
                mouse sobre una bolita para ver el acabado disponible (brillante,
                mate, texturizado, con destellos).
              </p>
            </div>
            <div className="md:col-span-5">
              <ColorPicker
                selectedId={selectedColor?.id ?? null}
                onSelect={setSelectedColor}
              />
            </div>
          </div>
        </section>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          INFO + CTA - integrado, sin cuadrículas
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="mx-auto max-w-[1600px] px-6 pb-20 md:px-12 md:pb-28">
        <div className="grid gap-12 md:grid-cols-12 md:gap-x-16">
          {/* IZQUIERDA: descripción + specs en línea fluida */}
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
                <span aria-hidden className="text-cobalt/25">
                  ·
                </span>
                <span>Garantía 3 años</span>
                <span aria-hidden className="text-cobalt/25">
                  ·
                </span>
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
