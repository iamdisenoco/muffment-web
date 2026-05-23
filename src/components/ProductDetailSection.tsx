"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ColorPicker } from "./ColorPicker";
import { AddToCartButton } from "./AddToCartButton";
import type { Product } from "@/data/products";
import type { Color } from "@/data/colors";
import { cn, whatsappLink } from "@/lib/utils";
import { gsap, useGSAP } from "@/lib/gsap";

// helpers ------------------------------------------------------------

/** Saca un tagline de 1 línea de la descripción larga (primera oración). */
function shortenTagline(desc: string): string {
  const firstSentence = desc.split(/[.·]/)[0]?.trim() ?? desc;
  return firstSentence.length > 90
    ? firstSentence.slice(0, 87) + "…"
    : firstSentence;
}

const whatsAppHref = whatsappLink;

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
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

  const dynamicHero =
    colorPrefix && selectedColor
      ? `/img/products/colors/${colorPrefix}-${selectedColor.id}.jpg`
      : product.hero;

  // Photos: hero dinámico (cambia con el color) + gallery del producto.
  const images = [dynamicHero, ...(product.gallery ?? [])];
  const activeImg = images[activeIdx] ?? images[0];

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
      {/* Layout Musotoku: foto domina (col-8), rail minimal (col-4).
          El rail solo tiene lo esencial — nombre, precio, color, CTA único. */}
      <section className="mx-auto max-w-[1600px] px-6 pt-4 md:px-12 md:pt-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-16">
          {/* ───── COL IZQUIERDA: HERO PHOTO + THUMBNAILS ───── */}
          <div className="md:col-span-8">
            <PhotoHero
              activeImg={activeImg}
              images={images}
              activeIdx={activeIdx}
              onSelect={setActiveIdx}
              alt={product.name}
            />
          </div>

          {/* ───── COL DERECHA: STICKY RAIL MINIMAL ───── */}
          <aside className="md:col-span-4">
            <div className="md:sticky md:top-28 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto md:pr-1 md:pb-6 md:pt-1 md:[scrollbar-width:thin]">
              {/* eyebrow técnico */}
              <p
                className="pd-rail-block text-[10px] uppercase tracking-[0.35em] text-cobalt/55"
                style={monoStyle}
              >
                {product.categoryLabel} · N°{product.code}
              </p>

              {/* nombre del producto */}
              <h1
                className="pd-rail-block mt-2 leading-[0.95] tracking-tight text-cobalt"
                style={{
                  ...displayStyle,
                  fontSize: "clamp(1.75rem, 2.6vw, 2.5rem)",
                }}
              >
                {product.name}
              </h1>

              {/* tagline ultra-corto (1 línea max) — derivado de la
                  descripción, primera oración. Si la descripción del
                  producto ya es corta (≤80 chars), se usa entera. */}
              <p
                className="pd-rail-block mt-3 text-[13px] leading-snug text-cobalt/70"
                style={monoStyle}
              >
                {shortenTagline(product.description)}
              </p>

              {/* precio — GRANDE, dominante */}
              <div className="pd-rail-block mt-7">
                <p
                  className="text-[9px] uppercase tracking-[0.3em] text-cobalt/55"
                  style={monoStyle}
                >
                  Desde
                </p>
                <p
                  className="leading-none tabular-nums text-cobalt"
                  style={{
                    ...displayStyle,
                    fontSize: "clamp(2.5rem, 3.4vw, 3.5rem)",
                  }}
                >
                  {product.priceLabel}
                </p>
              </div>

              {/* COLOR PICKER mini (solo si el producto tiene picker) */}
              {colorPrefix && (
                <div className="pd-rail-block mt-7">
                  <div className="mb-3 flex items-center gap-2">
                    {selectedColor ? (
                      <>
                        <span
                          aria-hidden
                          className="block h-4 w-4 shrink-0 rounded-full border border-cobalt/15"
                          style={{ backgroundColor: selectedColor.hex }}
                        />
                        <p
                          className="text-[11px] text-cobalt"
                          style={monoStyle}
                        >
                          <span className="text-cobalt/55">Color:</span>{" "}
                          <span className="font-medium">
                            {selectedColor.name}
                          </span>
                        </p>
                      </>
                    ) : (
                      <p
                        className="text-[11px] text-cobalt/65"
                        style={monoStyle}
                      >
                        + de 90 colores · pintura electrostática
                      </p>
                    )}
                  </div>

                  <ColorPicker
                    selectedId={selectedColor?.id ?? null}
                    onSelect={(c) => {
                      setSelectedColor(c);
                      setActiveIdx(0);
                    }}
                  />
                </div>
              )}

              {/* CTA único grande */}
              <div className="pd-rail-block mt-7">
                <AddToCartButton
                  product={product}
                  selectedColor={selectedColor}
                />

                {/* Preguntar como link text discreto (no botón) */}
                <a
                  href={whatsAppHref(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="mt-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-cobalt/65 transition-colors hover:text-cobalt"
                  style={monoStyle}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.46 1.34 4.97L2 22l5.2-1.36c1.46.79 3.1 1.21 4.79 1.21h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04C17.16 3.04 14.66 2 12.04 2z" />
                  </svg>
                  Preguntar por WhatsApp
                </a>
              </div>

              {/* selling points en línea horizontal compacta */}
              <ul
                className="pd-rail-block mt-7 flex flex-wrap gap-x-4 gap-y-1 border-t border-cobalt/10 pt-5 text-[10px] uppercase tracking-[0.18em] text-cobalt/55"
                style={monoStyle}
              >
                <li className="flex items-center gap-1.5">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-cobalt/45" />
                  Bajo pedido · 4 sem
                </li>
                <li className="flex items-center gap-1.5">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-cobalt/45" />
                  Garantía 3 años
                </li>
                <li className="flex items-center gap-1.5">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-cobalt/45" />
                  Hecho en Colombia
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* Descripción larga del producto — debajo del hero, full-width
            izquierda, como párrafo editorial. Mantiene el rail limpio. */}
        <div className="mt-16 grid grid-cols-1 md:mt-24 md:grid-cols-12 md:gap-x-16">
          <div className="md:col-span-8">
            <p
              className="text-[10px] uppercase tracking-[0.3em] text-cobalt/55"
              style={monoStyle}
            >
              Sobre este aviso
            </p>
            <p className="mt-3 max-w-[58ch] text-base leading-relaxed text-cobalt/80 md:text-[17px]">
              {product.description}
            </p>
          </div>
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
 * Photo Hero — patrón Musotoku:
 *   - UNA foto principal grande (aspect-square)
 *   - Si hay multiples imágenes, debajo aparece una tira de thumbnails
 *   - Click en thumb cambia la foto activa con fade
 *   - Color picker también cambia activeImg automáticamente (via key)
 */
function PhotoHero({
  activeImg,
  images,
  activeIdx,
  onSelect,
  alt,
}: {
  activeImg: string;
  images: string[];
  activeIdx: number;
  onSelect: (i: number) => void;
  alt: string;
}) {
  const hasMultiple = images.length > 1;

  return (
    <div className="space-y-4">
      {/* HERO photo grande */}
      <div className="pd-photo-frame relative aspect-square w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImg}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.21, 0.6, 0.35, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={activeImg}
              alt={alt}
              fill
              priority
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

      {/* Tira de thumbnails (solo si hay 2+ fotos) */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={`${i}-${src}`}
              type="button"
              onClick={() => onSelect(i)}
              data-cursor="hover"
              aria-label={`Imagen ${i + 1}`}
              aria-pressed={i === activeIdx}
              className={cn(
                "relative aspect-square w-20 shrink-0 overflow-hidden rounded-md border bg-white transition-all md:w-24",
                i === activeIdx
                  ? "border-cobalt opacity-100"
                  : "border-cobalt/15 opacity-65 hover:opacity-100 hover:border-cobalt/40",
              )}
            >
              <Image
                src={src}
                alt={`${alt} ${i + 1}`}
                fill
                sizes="96px"
                className="object-contain"
                style={{ mixBlendMode: "multiply" }}
              />
            </button>
          ))}
        </div>
      )}
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
