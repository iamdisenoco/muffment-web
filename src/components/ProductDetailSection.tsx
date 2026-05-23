"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ColorPicker } from "./ColorPicker";
import { AddToCartButton } from "./AddToCartButton";
import type { Product } from "@/data/products";
import type { Color } from "@/data/colors";
import { cn, whatsappLink } from "@/lib/utils";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  product: Product;
  colorPrefix?: string;
};

// Mensajes rotantes en la cabecera (arriba del marquee)
const ROTATING_PILLARS = [
  "Diseñado para durar",
  "0 oxidación",
  "Garantía de 3 años",
  "+ de 90 colores",
];

/**
 * Product Detail v8 — feedback Jon:
 *   ✓ Imagen MUCHO más grande
 *   ✓ Cabecera rotando entre 4 pilares (Diseñado / 0 oxidación / Garantía / Colores)
 *   ✓ Flechas prev/next AL LADO de la imagen (no thumbnails debajo)
 *   ✓ Color picker más pequeño AL LADO DERECHO del producto
 *   ✓ Descripción + medidas al lado derecho del producto
 *   ✓ Mantiene marquee horizontal + button-round verde abajo
 *
 *  ┌────────────────────────────────────────────────────┐
 *  │ DISEÑADO PARA DURAR  ← rotating cada 3.5s          │
 *  │ ───────────────────────────────────────            │
 *  │                                                     │
 *  │ ←  ┌─────────────────────┐  →  COLORES (mini)     │
 *  │    │                     │     ▣▣▣▣▣▣▣▣          │
 *  │    │   FOTO GIANT        │     ▣▣▣▣▣▣▣▣          │
 *  │    │   cinematic         │                          │
 *  │    │                     │     DESCRIPCIÓN          │
 *  │    └─────────────────────┘     ─────────             │
 *  │                                 MEDIDAS              │
 *  │ ┏━━━━━━━━━━━━━━━━━━━━┓ ●AGR  96 cm × 70 cm        │
 *  │ ┃ HABLADOR ✦ → → →  ┃          ÁREA 80 × 60        │
 *  │ ┗━━━━━━━━━━━━━━━━━━━━┛                              │
 *  └────────────────────────────────────────────────────┘
 */
export function ProductDetailSection({ product, colorPrefix }: Props) {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

  // Rotar el mensaje de cabecera cada 3.5s
  useEffect(() => {
    const id = setInterval(() => {
      setMsgIdx((i) => (i + 1) % ROTATING_PILLARS.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const dynamicHero =
    colorPrefix && selectedColor
      ? `/img/products/colors/${colorPrefix}-${selectedColor.id}.jpg`
      : product.hero;

  const images = [dynamicHero, ...(product.gallery ?? [])];
  const activeImg = images[activeIdx] ?? images[0];
  const hasMultiple = images.length > 1;

  const message = `Hola MUFFMENT, quiero el ${product.name}${selectedColor ? ` en color ${selectedColor.name}` : ""} (${product.priceLabel}). ¿Me ayudas con la cotización?`;

  const monoStyle = { fontFamily: '"Satoshi", system-ui, sans-serif' };
  const displayStyle = { fontFamily: "var(--font-bagel)" };

  const marqueeName = product.name.toUpperCase();

  const goPrev = () =>
    setActiveIdx((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setActiveIdx((i) => (i + 1) % images.length);

  useGSAP(
    () => {
      gsap.from(".pd-hero-photo", {
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: "expo.out",
      });
      gsap.from(".pd-hero-info-block", {
        opacity: 0,
        x: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.3,
      });
      gsap.from(".pd-hero-marquee", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        delay: 0.55,
      });
      gsap.from(".pd-hero-button", {
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: 0.85,
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
    <article ref={containerRef} className="relative bg-black text-white">
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO COMPACTO bg:black — todo entra en above-the-fold            */}
      {/* Orden vertical (feedback Jon):                                    */}
      {/*   1. Cabecera rotando                                             */}
      {/*   2. Marquee con nombre + button AGREGAR (ARRIBA, no abajo)       */}
      {/*   3. Grid foto izq + info derecha                                 */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1700px] px-4 pb-10 pt-4 md:px-10 md:pb-14 md:pt-6">
          {/* ───── CABECERA ROTANDO ARRIBA ───── */}
          <div className="mb-3 flex h-6 items-center md:h-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={msgIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="text-xs font-bold uppercase tracking-[0.25em] text-white md:text-sm"
                style={monoStyle}
              >
                {ROTATING_PILLARS[msgIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* ───── MARQUEE + BUTTON-ROUND ARRIBA ───── */}
          <div
            className="pd-hero-marquee relative mb-8 border-y border-white/70 py-3 md:mb-10 md:py-4"
            style={{ overflow: "visible" }}
          >
            <div
              className="flex w-fit items-center whitespace-nowrap pr-32 md:pr-40"
              style={{
                animation: "muff-marquee 25s linear infinite",
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="flex items-center"
                  style={{ paddingRight: "2.5rem" }}
                >
                  <span
                    className="leading-none"
                    style={{
                      ...displayStyle,
                      fontSize: "clamp(1.75rem, 4.2vw, 3.75rem)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {marqueeName}
                  </span>
                  <span
                    aria-hidden
                    className="ml-6 text-white/70"
                    style={{
                      fontSize: "clamp(1.1rem, 2.2vw, 1.75rem)",
                    }}
                  >
                    ✦
                  </span>
                </span>
              ))}
            </div>

            {/* BUTTON-ROUND verde fluo cortado por el border-bottom */}
            <div
              className="pd-hero-button absolute z-30"
              style={{
                right: "0.5rem",
                top: "100%",
                transform: "translateY(-50%)",
              }}
              id="agregar"
            >
              <RoundAddButton
                product={product}
                selectedColor={selectedColor}
              />
            </div>
          </div>

          {/* ───── GRID PRINCIPAL: foto-flechas IZQ · info DER ───── */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-x-10">
            {/* COL FOTO + FLECHAS (col-9) */}
            <div className="relative md:col-span-9">
              <div className="pd-hero-photo relative flex items-center justify-center">
                {/* Flecha PREV */}
                {hasMultiple && (
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Imagen anterior"
                    data-cursor="hover"
                    className="absolute left-0 z-20 flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-sm transition-all hover:scale-110 hover:border-white/50 hover:text-white md:-left-2 md:h-20 md:w-20"
                  >
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                )}

                {/* IMAGEN dominante pero respetando viewport */}
                <div
                  className="relative aspect-square w-full"
                  style={{
                    // max-h dinámico: 55% del viewport-height máximo, así
                    // queda lugar arriba para cabecera+marquee+button y
                    // abajo para los dots, sin scroll forzado.
                    maxWidth: "min(55vh, 680px)",
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImg}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.21, 0.6, 0.35, 1],
                      }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={activeImg}
                        alt={product.name}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 820px"
                        className="object-contain"
                        style={{
                          filter:
                            "drop-shadow(0 40px 80px rgba(0,0,0,0.5))",
                        }}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Flecha NEXT */}
                {hasMultiple && (
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Imagen siguiente"
                    data-cursor="hover"
                    className="absolute right-0 z-20 flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-sm transition-all hover:scale-110 hover:border-white/50 hover:text-white md:-right-2 md:h-20 md:w-20"
                  >
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Dots indicator debajo de la foto */}
              {hasMultiple && (
                <div className="mt-5 flex items-center justify-center gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Imagen ${i + 1}`}
                      onClick={() => setActiveIdx(i)}
                      data-cursor="hover"
                      className={cn(
                        "h-1 rounded-full transition-all",
                        i === activeIdx
                          ? "w-8 bg-white"
                          : "w-1 bg-white/30 hover:bg-white/60",
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* COL INFO DERECHA (col-3) — colors + desc + medidas */}
            <aside className="md:col-span-3">
              {/* Eyebrow técnico */}
              <p
                className="pd-hero-info-block text-[10px] uppercase tracking-[0.3em] text-white/55"
                style={monoStyle}
              >
                {product.categoryLabel} · N°{product.code}
              </p>

              {/* Precio */}
              <div className="pd-hero-info-block mt-3">
                <p
                  className="text-[9px] uppercase tracking-[0.3em] text-white/55"
                  style={monoStyle}
                >
                  Desde
                </p>
                <p
                  className="leading-none tabular-nums text-white"
                  style={{
                    ...displayStyle,
                    fontSize: "clamp(1.75rem, 2.6vw, 2.5rem)",
                  }}
                >
                  {product.priceLabel}
                </p>
              </div>

              {/* COLOR PICKER mini */}
              {colorPrefix && (
                <div className="pd-hero-info-block mt-6 border-t border-white/10 pt-5">
                  <div className="mb-2 flex items-baseline justify-between">
                    <p
                      className="text-[10px] uppercase tracking-[0.3em] text-white/65"
                      style={monoStyle}
                    >
                      Color
                    </p>
                    <p
                      className="text-[10px] text-white/45"
                      style={monoStyle}
                    >
                      + de 90
                    </p>
                  </div>

                  {selectedColor && (
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        aria-hidden
                        className="block h-3 w-3 shrink-0 rounded-full border border-white/15"
                        style={{ backgroundColor: selectedColor.hex }}
                      />
                      <p
                        className="text-[11px] text-white"
                        style={monoStyle}
                      >
                        {selectedColor.name}
                      </p>
                    </div>
                  )}

                  {/* Wrapper con override CSS para invertir colores del
                      ColorPicker (que está pensado para fondo blanco) */}
                  <div className="muff-picker-dark">
                    <ColorPicker
                      selectedId={selectedColor?.id ?? null}
                      onSelect={(c) => {
                        setSelectedColor(c);
                        setActiveIdx(0);
                      }}
                    />
                  </div>
                </div>
              )}

              {/* DESCRIPCIÓN */}
              <div className="pd-hero-info-block mt-6 border-t border-white/10 pt-5">
                <p
                  className="mb-2 text-[10px] uppercase tracking-[0.3em] text-white/65"
                  style={monoStyle}
                >
                  Descripción
                </p>
                <p className="text-[13px] leading-relaxed text-white/75">
                  {product.description}
                </p>
              </div>

              {/* MEDIDAS */}
              <div className="pd-hero-info-block mt-6 border-t border-white/10 pt-5">
                <p
                  className="mb-3 text-[10px] uppercase tracking-[0.3em] text-white/65"
                  style={monoStyle}
                >
                  Medidas
                </p>
                <dl className="space-y-2 text-[12px]" style={monoStyle}>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <dt className="text-white/55">Total</dt>
                    <dd className="text-white">{product.totalSize}</dd>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <dt className="text-white/55">Arte</dt>
                    <dd className="text-white">{product.artSize}</dd>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <dt className="text-white/55">Material</dt>
                    <dd className="max-w-[60%] text-right text-white">
                      Acero
                    </dd>
                  </div>
                </dl>
              </div>

              {/* WhatsApp link discreto */}
              <a
                href={whatsappLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="pd-hero-info-block mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/55 transition-colors hover:text-white"
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
            </aside>
          </div>

        </div>
      </section>

      {/* ═══════════════════ SPECS COMPLETOS (debajo del hero) ═══════════════════ */}
      <section className="pd-specs-section bg-white">
        <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28">
          <div className="mb-10 flex items-end justify-between border-b border-cobalt/15 pb-6">
            <h2
              className="text-cobalt"
              style={{
                ...displayStyle,
                fontSize: "clamp(1.5rem, 2.4vw, 2.5rem)",
                lineHeight: 0.95,
              }}
            >
              Ficha técnica completa
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
            <p
              className="pd-spec mt-10 max-w-[68ch] text-xs leading-relaxed text-cobalt/65"
              style={monoStyle}
            >
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
      </section>
    </article>
  );
}

/**
 * Round Add Button — el "VIEW" verde fluo de Musotoku, AGREGAR para nosotros.
 * Posición absolute right del marquee, cortado por el border-bottom.
 */
function RoundAddButton({
  product,
  selectedColor,
}: {
  product: Product;
  selectedColor: Color | null;
}) {
  return (
    <div className="relative">
      {/* Hidden AddToCartButton para tener la lógica del carrito */}
      <div className="absolute -z-10 opacity-0">
        <AddToCartButton product={product} selectedColor={selectedColor} />
      </div>
      <button
        type="button"
        onClick={(e) => {
          // Click programático al botón oculto
          const hidden = (e.currentTarget.parentElement?.querySelector(
            "button",
          ) ?? null) as HTMLButtonElement | null;
          if (hidden && hidden !== e.currentTarget) hidden.click();
        }}
        data-cursor="hover"
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#06d6a0] text-black shadow-2xl transition-transform hover:scale-110 md:h-24 md:w-24"
        aria-label={`Agregar ${product.name} al carrito`}
        style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] md:text-[11px]">
          Agregar
        </span>
        {selectedColor && (
          <span
            aria-hidden
            className="absolute -right-1 -top-1 block h-5 w-5 rounded-full border-2 border-black"
            style={{ backgroundColor: selectedColor.hex }}
          />
        )}
      </button>
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
