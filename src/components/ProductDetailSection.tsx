"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ColorPicker } from "./ColorPicker";
import { useCart } from "@/hooks/useCart";
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
      {/* GRADIENT TRANSITION white→black para mimetizar fronterea con     */}
      {/* el main bg-white de arriba (feedback Jon: "mimetizar")           */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 md:h-32"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 25%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO COMPACTO bg:black — todo entra en above-the-fold            */}
      {/* Orden vertical (feedback Jon):                                    */}
      {/*   1. Marquee con nombre + button AGREGAR ARRIBA                  */}
      {/*   2. Grid foto izq + info derecha                                 */}
      {/*   3. SELLO PREMIUM cerca del producto con texto rotando          */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="relative z-20 mx-auto max-w-[1700px] px-4 pb-10 pt-10 md:px-10 md:pb-14 md:pt-14">

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
                    maxWidth: "min(55vh, 680px)",
                  }}
                >
                  {/* ───── SELLO PREMIUM con texto rotando ─────
                      Posicionado absolute sobre la foto, esquina superior
                      derecha (cerca del producto como pidió Jon). Estilo
                      wax-stamp circular: doble ring border cream, sparkle
                      ✦ arriba y abajo, texto centrado cambiando cross-fade.
                      Rotación lenta sutil de todo el sello. */}
                  <motion.div
                    className="absolute -right-3 -top-3 z-30 flex h-28 w-28 items-center justify-center rounded-full bg-black/55 backdrop-blur-md md:-right-6 md:-top-6 md:h-36 md:w-36"
                    style={{
                      border: "1.5px solid rgba(232,226,209,0.5)",
                      boxShadow:
                        "0 0 0 1px rgba(0,0,0,0.4), inset 0 0 0 4px rgba(0,0,0,0.4), inset 0 0 0 5px rgba(232,226,209,0.25), 0 10px 30px rgba(0,0,0,0.6)",
                    }}
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 90,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    {/* Contenido NO rota (counter-rotation para legibilidad) */}
                    <motion.div
                      animate={{ rotate: [0, -360] }}
                      transition={{
                        duration: 90,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="flex flex-col items-center justify-center text-center"
                    >
                      <span
                        aria-hidden
                        className="text-[14px] leading-none text-cream/85 md:text-[18px]"
                      >
                        ✦
                      </span>
                      <div className="my-1 flex h-7 w-16 items-center justify-center md:my-1.5 md:h-8 md:w-20">
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={msgIdx}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{
                              duration: 0.4,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="px-1 text-[8.5px] font-bold uppercase leading-[1.1] tracking-[0.13em] text-cream md:text-[10px] md:tracking-[0.15em]"
                            style={monoStyle}
                          >
                            {ROTATING_PILLARS[msgIdx]}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                      <span
                        aria-hidden
                        className="text-[14px] leading-none text-cream/85 md:text-[18px]"
                      >
                        ✦
                      </span>
                    </motion.div>
                  </motion.div>

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
 * Round Add Button — botón circular MUFFMENT con colores de marca
 * (cream bg + cobalt text) y efecto magnético: el botón sigue al cursor
 * con spring physics. Usa useCart() directamente (no hidden wrapper).
 *
 * Estilo "stamp"/sello premium con doble ring, similar al sello rotativo
 * pero estático (excepto por el magnetic follow del cursor).
 */
function RoundAddButton({
  product,
  selectedColor,
}: {
  product: Product;
  selectedColor: Color | null;
}) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // Magnetic — el botón se atrae al cursor cuando está cerca
  const handleMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - r.left - r.width / 2) * 0.3,
      y: (e.clientY - r.top - r.height / 2) * 0.3,
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
        ? {
            id: selectedColor.id,
            name: selectedColor.name,
            hex: selectedColor.hex,
          }
        : undefined,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const transition = {
    type: "spring" as const,
    stiffness: 220,
    damping: 18,
    mass: 0.55,
  };

  return (
    <motion.button
      ref={btnRef}
      type="button"
      onClick={handleClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={pos}
      transition={transition}
      data-cursor="hover"
      className={cn(
        "relative flex h-24 w-24 items-center justify-center rounded-full shadow-2xl md:h-28 md:w-28",
        justAdded
          ? "bg-[#06d6a0] text-cobalt"
          : "bg-cream text-cobalt",
      )}
      style={{
        boxShadow: justAdded
          ? "0 14px 36px -6px rgba(6,214,160,0.5)"
          : "0 14px 38px -6px rgba(232,226,209,0.35), inset 0 0 0 1.5px rgba(50,54,183,0.12)",
        fontFamily: '"Satoshi", system-ui, sans-serif',
      }}
      aria-label={`Agregar ${product.name} al carrito`}
    >
      <motion.span
        className="flex flex-col items-center px-2 text-center leading-[1.05]"
        animate={{ x: pos.x * 0.5, y: pos.y * 0.5 }}
        transition={transition}
      >
        {justAdded ? (
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] md:text-[11px]">
            ✓ Agregado
          </span>
        ) : (
          <>
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] md:text-[10px]">
              Agregar al
            </span>
            <span
              className="mt-0.5 text-[14px] uppercase leading-none md:text-[16px]"
              style={{
                fontFamily: "var(--font-bagel)",
                letterSpacing: "0.01em",
              }}
            >
              carrito
            </span>
          </>
        )}
      </motion.span>

      {/* Chip color seleccionado decorativo */}
      {selectedColor && !justAdded && (
        <span
          aria-hidden
          className="absolute -right-1 -top-1 block h-5 w-5 rounded-full border-2 border-cream"
          style={{ backgroundColor: selectedColor.hex }}
        />
      )}
    </motion.button>
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
