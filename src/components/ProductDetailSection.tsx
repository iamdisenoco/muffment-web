"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ColorPicker } from "./ColorPicker";
import { AddToCartButton } from "./AddToCartButton";
import { WhatsAppButton } from "./WhatsAppButton";
import { PremiumBadge } from "./PremiumBadge";
import type { Product } from "@/data/products";
import type { Color } from "@/data/colors";
import { cn } from "@/lib/utils";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  product: Product;
  colorPrefix?: string;
};

/**
 * Product Detail Hero v3 — inspired by reels (Coffee Lounge + Starry Labs +
 * Spaceadv brutalist typography). Hero cinematográfico:
 *
 *   ╔════════════════════════════════════════════════╗
 *   ║  NOMBRE PRODUCTO  ⬅ backdrop typography GIANTE  ║
 *   ║  ─────────────────────────────────────────────  ║
 *   ║  [precio]    [PHOTO PARALLAX]    [colores]      ║
 *   ║  [desc]                                         ║
 *   ║  [mag CTA]                                      ║
 *   ╚════════════════════════════════════════════════╝
 *
 * Las animaciones GSAP+ScrollTrigger se inicializan dentro de useGSAP
 * con un scope al containerRef para que se limpien al desmontar.
 */
export function ProductDetailSection({ product, colorPrefix }: Props) {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

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

  // ─── GSAP animations ──────────────────────────────────────────────
  useGSAP(
    () => {
      // 1. Backdrop typography — parallax sutil descendente
      gsap.to(".pd-backdrop-type", {
        yPercent: 35,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // 2. Foto del producto — parallax inverso (sube más lento)
      gsap.to(".pd-hero-photo", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // 3. Reveals iniciales — character stagger del nombre
      gsap.from(".pd-name-char", {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        stagger: 0.04,
        ease: "expo.out",
        delay: 0.15,
      });

      // 4. Reveals del rail izquierdo + derecho
      gsap.from(".pd-rail-item", {
        opacity: 0,
        y: 16,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.4,
      });

      // 5. Specs — reveal en scroll, batched
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

  // Split the product name into characters for the reveal animation.
  // Spaces preserved as &nbsp; for proper kerning.
  const nameChars = product.name.split("");

  return (
    <article ref={containerRef} className="relative bg-white">
      {/* ═══════════════════ HERO CINEMATOGRÁFICO ═══════════════════ */}
      <section className="relative overflow-hidden pb-16 md:pb-24">
        {/* ─── BACKDROP TYPOGRAPHY GIANTE ─── */}
        {/* El nombre del producto en tamaño masivo (clamp 11vw → 22vw)
            con gradiente cobalt + blend mode multiply para no tapar el
            producto. Vive detrás del grid (z-0) y se mueve con parallax. */}
        <div
          aria-hidden
          className="pd-backdrop-type pointer-events-none absolute inset-x-0 top-0 z-0 flex items-start justify-center pt-8 md:pt-16"
        >
          <h2
            className="select-none whitespace-nowrap text-center leading-[0.82] text-cobalt/[0.045] md:tracking-[-0.04em]"
            style={{
              ...displayStyle,
              fontSize: "clamp(5rem, 18vw, 22rem)",
            }}
          >
            {product.shortName.toUpperCase()}
          </h2>
        </div>

        <div className="relative z-10 mx-auto max-w-[1700px] px-6 pt-6 md:px-12 md:pt-10">
          {/* Eyebrow técnico (categoria + código) */}
          <div className="mb-3 flex items-center justify-center gap-3 text-center md:mb-5">
            <span
              aria-hidden
              className="h-px w-10 bg-cobalt/30"
            />
            <p
              className="text-[10px] uppercase tracking-[0.4em] text-cobalt/65"
              style={monoStyle}
            >
              {product.categoryLabel} · N°{product.code}
            </p>
            <span
              aria-hidden
              className="h-px w-10 bg-cobalt/30"
            />
          </div>

          {/* Nombre real con character stagger reveal */}
          <h1
            className="mb-10 overflow-hidden text-center leading-none tracking-tight text-cobalt md:mb-14"
            style={{
              ...displayStyle,
              fontSize: "clamp(1.75rem, 4vw, 3.75rem)",
            }}
          >
            <span className="inline-block overflow-hidden align-bottom">
              {nameChars.map((ch, idx) => (
                <span
                  key={idx}
                  className="pd-name-char inline-block"
                  style={{ whiteSpace: ch === " " ? "pre" : "normal" }}
                >
                  {ch === " " ? " " : ch}
                </span>
              ))}
            </span>
          </h1>

          {/* GRID 3-COL: info izq · foto centro · colores derecha */}
          <div className="grid items-start gap-8 md:grid-cols-12 md:gap-x-8">
            {/* ────── IZQUIERDA (col-3) ────── */}
            <div className="md:col-span-3 md:sticky md:top-32 md:self-start">
              <div className="pd-rail-item">
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
              </div>

              <p className="pd-rail-item mt-5 text-sm leading-relaxed text-cobalt/75 md:text-[15px]">
                {product.description}
              </p>

              {selectedColor && (
                <div className="pd-rail-item mt-4 flex items-center gap-2">
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
                    <p className="text-sm text-cobalt" style={displayStyle}>
                      {selectedColor.name}
                    </p>
                  </div>
                </div>
              )}

              <div className="pd-rail-item mt-6 space-y-2.5">
                <AddToCartButton
                  product={product}
                  selectedColor={selectedColor}
                />
                <WhatsAppButton message={message} size="lg" variant="ghost">
                  Preguntar
                </WhatsAppButton>
              </div>

              <div
                className="pd-rail-item mt-6 flex flex-col gap-1.5 text-[10px] uppercase tracking-[0.22em] text-cobalt/55"
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

            {/* ────── CENTRO (col-6): FOTO + PARALLAX ────── */}
            <div
              className={cn(
                "relative",
                colorPrefix ? "md:col-span-6" : "md:col-span-9",
              )}
            >
              {/* Premium badge — esquina sup derecha sobre la foto */}
              <div className="pd-rail-item absolute right-0 top-0 z-30 hidden md:block">
                <PremiumBadge />
              </div>

              <div className="pd-hero-photo relative mx-auto flex items-center justify-center">
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
                      transition={{
                        duration: 0.4,
                        ease: [0.21, 0.6, 0.35, 1],
                      }}
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

              {/* Premium badge inline en mobile */}
              <div className="mt-5 flex justify-center md:hidden">
                <PremiumBadge />
              </div>
            </div>

            {/* ────── DERECHA (col-3): COLOR PICKER ────── */}
            {colorPrefix && (
              <div className="md:col-span-3 md:sticky md:top-32 md:self-start">
                <div className="pd-rail-item">
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
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SPECS (scroll reveals) ═══════════════════ */}
      <section className="pd-specs-section mx-auto max-w-[1600px] px-6 pb-20 md:px-12 md:pb-28 md:pt-8">
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
          <p className="pd-spec mt-8 max-w-[60ch] text-xs leading-relaxed text-cobalt/65">
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
