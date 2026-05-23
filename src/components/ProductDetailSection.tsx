"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ColorPicker } from "./ColorPicker";
import { AddToCartButton } from "./AddToCartButton";
import { WhatsAppButton } from "./WhatsAppButton";
import type { Product } from "@/data/products";
import type { Color } from "@/data/colors";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  product: Product;
  colorPrefix?: string;
};

/**
 * Product Detail v5 — layout Musotoku.
 *
 * Patrón:
 *   col-7 (izq): fotos apiladas verticalmente, scrolleables
 *   col-5 (der): RAIL STICKY top-32 que viaja con el usuario:
 *                eyebrow + nombre + precio + descripción +
 *                color picker + CTA + meta. Siempre visible.
 *
 * Mientras el usuario hace scroll por las fotos (puede haber 1-3 por
 * producto), el rail derecho se mantiene fijo así que el botón
 * "Agregar al carrito" y el color picker siempre están a un click.
 *
 *   ┌────────────────────────────────────┐
 *   │ [Breadcrumb]                        │
 *   │                                     │
 *   │ ┌────────────┐  ┌─────────────┐    │
 *   │ │            │  │ HABLADOR…   │    │
 *   │ │  FOTO 1    │  │ Plegable    │    │
 *   │ │            │  │             │    │
 *   │ │            │  │ $780K       │    │
 *   │ └────────────┘  │             │    │
 *   │ ┌────────────┐  │ desc…       │    │
 *   │ │            │  │             │    │
 *   │ │  FOTO 2    │  │ [picker]    │ ←  │ STICKY
 *   │ │            │  │             │    │
 *   │ │            │  │ [AGREGAR]   │    │
 *   │ └────────────┘  │ [Preguntar] │    │
 *   │ ┌────────────┐  │             │    │
 *   │ │  FOTO 3    │  │ • bajo ped. │    │
 *   │ │            │  │ • garantía  │    │
 *   │ └────────────┘  │ • Colombia  │    │
 *   │                  └─────────────┘    │
 *   │                                     │
 *   │ ▼ Specs técnicas (sección debajo)  │
 *   └────────────────────────────────────┘
 */
export function ProductDetailSection({ product, colorPrefix }: Props) {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  const dynamicHero =
    colorPrefix && selectedColor
      ? `/img/products/colors/${colorPrefix}-${selectedColor.id}.jpg`
      : product.hero;

  // Photos: hero dinámico (cambia con el color) + gallery del producto.
  const images = [dynamicHero, ...(product.gallery ?? [])];

  const message = `Hola MUFFMENT, quiero el ${product.name}${selectedColor ? ` en color ${selectedColor.name}` : ""} (${product.priceLabel}). ¿Me ayudas con la cotización?`;

  const monoStyle = { fontFamily: '"Satoshi", system-ui, sans-serif' };
  const displayStyle = { fontFamily: "var(--font-bagel)" };

  // GSAP reveals — sutiles, sin distracción
  useGSAP(
    () => {
      gsap.from(".pd-photo-frame", {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from(".pd-rail-block", {
        opacity: 0,
        y: 12,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.from(".pd-spec", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".pd-specs-section",
          start: "top 80%",
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <article ref={containerRef} className="bg-white">
      {/* ═══════════ HERO 2-COL — foto izq · sticky rail der ═══════════ */}
      <section className="mx-auto max-w-[1600px] px-6 pt-2 md:px-12 md:pt-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-x-12">
          {/* ───── COL IZQUIERDA: PHOTOS STACK ───── */}
          <div className="md:col-span-7 lg:col-span-7">
            <PhotoStack
              images={images}
              alt={product.name}
              colorChangeKey={dynamicHero}
            />
          </div>

          {/* ───── COL DERECHA: STICKY RAIL ───── */}
          <aside className="md:col-span-5 lg:col-span-5">
            <div className="md:sticky md:top-28 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto md:pr-1 md:pb-6 md:pt-2 md:[scrollbar-width:thin]">
              {/* eyebrow técnico */}
              <p
                className="pd-rail-block text-[10px] uppercase tracking-[0.35em] text-cobalt/55"
                style={monoStyle}
              >
                {product.categoryLabel} · N°{product.code}
              </p>

              {/* nombre del producto */}
              <h1
                className="pd-rail-block mt-2 leading-[0.92] tracking-tight text-cobalt"
                style={{
                  ...displayStyle,
                  fontSize: "clamp(2rem, 3.4vw, 3.5rem)",
                }}
              >
                {product.name}
              </h1>

              {/* precio */}
              <div className="pd-rail-block mt-5 flex items-baseline gap-3">
                <p
                  className="text-3xl text-cobalt tabular-nums md:text-4xl"
                  style={displayStyle}
                >
                  {product.priceLabel}
                </p>
                {product.priceEstimated && (
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] text-cobalt/55"
                    style={monoStyle}
                  >
                    desde · final según diseño
                  </p>
                )}
              </div>

              {/* descripción */}
              <p className="pd-rail-block mt-5 text-[14px] leading-relaxed text-cobalt/75 md:text-[15px]">
                {product.description}
              </p>

              {/* COLOR PICKER */}
              {colorPrefix && (
                <div className="pd-rail-block mt-7 border-t border-cobalt/10 pt-6">
                  <div className="mb-3 flex items-baseline justify-between">
                    <p
                      className="text-[10px] uppercase tracking-[0.3em] text-cobalt/65"
                      style={monoStyle}
                    >
                      Escogé tu color
                    </p>
                    <p
                      className="text-[10px] text-cobalt/55"
                      style={monoStyle}
                    >
                      + de 90 disponibles
                    </p>
                  </div>

                  {selectedColor && (
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        aria-hidden
                        className="block h-5 w-5 shrink-0 rounded-full border border-cobalt/10 shadow-sm"
                        style={{ backgroundColor: selectedColor.hex }}
                      />
                      <p
                        className="text-[13px] leading-tight text-cobalt"
                        style={displayStyle}
                      >
                        {selectedColor.name}
                      </p>
                    </div>
                  )}

                  <ColorPicker
                    selectedId={selectedColor?.id ?? null}
                    onSelect={setSelectedColor}
                  />
                </div>
              )}

              {/* CTA */}
              <div className="pd-rail-block mt-7 space-y-2.5 border-t border-cobalt/10 pt-6">
                <AddToCartButton
                  product={product}
                  selectedColor={selectedColor}
                />
                <WhatsAppButton message={message} size="md" variant="ghost">
                  Preguntar
                </WhatsAppButton>
              </div>

              {/* meta selling points (reemplazan al PremiumBadge) */}
              <div
                className="pd-rail-block mt-7 grid grid-cols-3 gap-2 border-t border-cobalt/10 pt-6 text-[10px] uppercase leading-tight tracking-[0.18em] text-cobalt/60"
                style={monoStyle}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-cobalt">Bajo pedido</span>
                  <span>4 semanas</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-cobalt">Garantía</span>
                  <span>3 años</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-cobalt">Origen</span>
                  <span>Colombia</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ═══════════ SPECS GRID (debajo del hero) ═══════════ */}
      <section className="pd-specs-section mx-auto mt-20 max-w-[1600px] px-6 pb-20 md:mt-32 md:px-12 md:pb-28">
        <div className="mb-10 flex items-end justify-between border-b border-cobalt/15 pb-6">
          <h2
            className="text-cobalt"
            style={{
              ...displayStyle,
              fontSize: "clamp(1.5rem, 2.4vw, 2.5rem)",
              lineHeight: 0.95,
            }}
          >
            Ficha técnica
          </h2>
          <p
            className="text-[10px] uppercase tracking-[0.35em] text-cobalt/55"
            style={monoStyle}
          >
            N°{product.code}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-12">
          <Spec
            label="Dimensiones"
            value={product.totalSize}
            className="pd-spec"
          />
          <Spec
            label="Área del arte"
            value={product.artSize}
            className="pd-spec"
          />
          <Spec
            label="Materiales"
            value={product.materials}
            className="pd-spec"
          />
          <Spec label="Pintura" value={product.paint} className="pd-spec" />
        </div>

        {product.notes && (
          <p className="pd-spec mt-10 max-w-[68ch] text-xs leading-relaxed text-cobalt/65">
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

/**
 * Photo Stack — todas las fotos del producto apiladas verticalmente.
 * El usuario hace scroll por ellas mientras el rail derecho permanece
 * sticky. Cada foto fade-in al entrar en viewport.
 *
 * El colorChangeKey provoca un re-fade cuando cambia el color
 * seleccionado (porque la primera imagen cambia de URL).
 */
function PhotoStack({
  images,
  alt,
  colorChangeKey,
}: {
  images: string[];
  alt: string;
  colorChangeKey: string;
}) {
  return (
    <div className="space-y-3 md:space-y-4">
      {images.map((src, i) => (
        <div
          key={`${i}-${i === 0 ? colorChangeKey : src}`}
          className="pd-photo-frame relative aspect-square w-full overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.21, 0.6, 0.35, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={src}
                alt={alt}
                fill
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-contain"
                style={{
                  mixBlendMode: "multiply",
                  filter: "drop-shadow(0 30px 40px rgba(50,54,183,0.10))",
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function Spec({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
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
