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

const ROTATING_PILLARS = [
  "Diseñado para durar",
  "0 oxidación",
  "Garantía de 3 años",
  "+ de 90 colores",
];

/**
 * Product Detail v10 — paleta INVERTIDA (feedback Jon):
 *   ✓ Hero bg-WHITE (antes negro)
 *   ✓ Specs section bg-COBALT (antes blanco)
 *   ✓ Texto default gris, detalles cobalt
 *   ✓ Botones pill OVALADOS cobalt + glow blanco neón
 *   ✓ Magnetic con MAYOR rango (percibe desde 250px)
 *   ✓ "Desde" → "Valor"
 *   ✓ Botón "Hablemos" con logo WhatsApp
 *   ✓ Transiciones difuminadas top + bottom
 */
export function ProductDetailSection({ product, colorPrefix }: Props) {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

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
    <article ref={containerRef} className="relative bg-white text-gray-500">
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO bg-WHITE (paleta invertida)                                 */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white">
        <div className="relative z-20 mx-auto max-w-[1700px] px-4 pb-20 pt-8 md:px-10 md:pb-32 md:pt-12">
          {/* ───── MARQUEE + BUTTON ARRIBA ─────
              bg-white propio para que sea legible incluso si todavía está
              encima del fade cobalt residual (el gradient cobalt-to-white
              de la página puede no terminar perfectamente aquí). */}
          <div
            className="pd-hero-marquee relative mb-10 border-y border-cobalt/30 bg-white py-3 md:mb-14 md:py-4"
            style={{ overflow: "visible" }}
          >
            <div
              className="flex w-fit items-center whitespace-nowrap pr-32 md:pr-44"
              style={{ animation: "muff-marquee 25s linear infinite" }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="flex items-center"
                  style={{ paddingRight: "2.5rem" }}
                >
                  <span
                    className="leading-none text-cobalt"
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
                    className="ml-6 text-cobalt/40"
                    style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.75rem)" }}
                  >
                    ✦
                  </span>
                </span>
              ))}
            </div>

            {/* BOTÓN AGREGAR pill ovalado cobalt + glow neón */}
            <div
              className="absolute z-30"
              style={{
                right: "0.5rem",
                top: "100%",
                transform: "translateY(-50%)",
              }}
              id="agregar"
            >
              <PillAddButton
                product={product}
                selectedColor={selectedColor}
              />
            </div>
          </div>

          {/* ───── GRID PRINCIPAL ───── */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-12">
            {/* COL FOTO + FLECHAS */}
            <div className="relative md:col-span-8">
              <div className="pd-hero-photo relative flex items-center justify-center">
                {/* Flecha PREV */}
                {hasMultiple && (
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Imagen anterior"
                    data-cursor="hover"
                    className="absolute left-0 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-cobalt/15 bg-white/80 text-cobalt/65 backdrop-blur-sm transition-all hover:scale-110 hover:border-cobalt/45 hover:text-cobalt md:-left-2 md:h-20 md:w-20"
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

                {/* IMAGEN */}
                <div
                  className="relative aspect-square w-full"
                  style={{ maxWidth: "min(60vh, 720px)" }}
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
                        sizes="(max-width: 768px) 100vw, 720px"
                        className="object-contain"
                        style={{
                          filter:
                            "drop-shadow(0 30px 50px rgba(50,54,183,0.18))",
                        }}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* SELLO PREMIUM pill ovalado outline cobalt */}
                  <PremiumSeal msgIdx={msgIdx} />
                </div>

                {/* Flecha NEXT */}
                {hasMultiple && (
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Imagen siguiente"
                    data-cursor="hover"
                    className="absolute right-0 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-cobalt/15 bg-white/80 text-cobalt/65 backdrop-blur-sm transition-all hover:scale-110 hover:border-cobalt/45 hover:text-cobalt md:-right-2 md:h-20 md:w-20"
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

              {/* Dots */}
              {hasMultiple && (
                <div className="mt-6 flex items-center justify-center gap-1.5">
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
                          ? "w-8 bg-cobalt"
                          : "w-1 bg-cobalt/25 hover:bg-cobalt/55",
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* COL INFO DERECHA */}
            <aside className="md:col-span-4">
              {/* Eyebrow técnico — detalle cobalt */}
              <p
                className="pd-hero-info-block text-[10px] uppercase tracking-[0.3em] text-cobalt/70"
                style={monoStyle}
              >
                {product.categoryLabel} · N°{product.code}
              </p>

              {/* Valor */}
              <div className="pd-hero-info-block mt-4">
                <p
                  className="text-[9px] uppercase tracking-[0.3em] text-gray-400"
                  style={monoStyle}
                >
                  Valor
                </p>
                <p
                  className="leading-none tabular-nums text-cobalt"
                  style={{
                    ...displayStyle,
                    fontSize: "clamp(1.75rem, 2.6vw, 2.5rem)",
                  }}
                >
                  {product.priceLabel}
                </p>
              </div>

              {/* COLOR PICKER */}
              {colorPrefix && (
                <div className="pd-hero-info-block mt-6 border-t border-gray-200 pt-5">
                  <div className="mb-2 flex items-baseline justify-between">
                    <p
                      className="text-[10px] uppercase tracking-[0.3em] text-gray-500"
                      style={monoStyle}
                    >
                      Color
                    </p>
                    <p
                      className="text-[10px] text-gray-400"
                      style={monoStyle}
                    >
                      + de 90
                    </p>
                  </div>

                  {selectedColor && (
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        aria-hidden
                        className="block h-3 w-3 shrink-0 rounded-full border border-cobalt/15"
                        style={{ backgroundColor: selectedColor.hex }}
                      />
                      <p
                        className="text-[11px] text-cobalt"
                        style={monoStyle}
                      >
                        {selectedColor.name}
                      </p>
                    </div>
                  )}

                  <ColorPicker
                    selectedId={selectedColor?.id ?? null}
                    onSelect={(c) => {
                      setSelectedColor(c);
                      setActiveIdx(0);
                    }}
                  />
                </div>
              )}

              {/* DESCRIPCIÓN */}
              <div className="pd-hero-info-block mt-6 border-t border-gray-200 pt-5">
                <p
                  className="mb-2 text-[10px] uppercase tracking-[0.3em] text-gray-500"
                  style={monoStyle}
                >
                  Descripción
                </p>
                <p className="text-[13px] leading-relaxed text-gray-600">
                  {product.description}
                </p>
              </div>

              {/* MEDIDAS */}
              <div className="pd-hero-info-block mt-6 border-t border-gray-200 pt-5">
                <p
                  className="mb-3 text-[10px] uppercase tracking-[0.3em] text-gray-500"
                  style={monoStyle}
                >
                  Medidas
                </p>
                <dl className="space-y-2 text-[12px]" style={monoStyle}>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <dt className="text-gray-400">Total</dt>
                    <dd className="text-gray-700">{product.totalSize}</dd>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <dt className="text-gray-400">Arte</dt>
                    <dd className="text-gray-700">{product.artSize}</dd>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <dt className="text-gray-400">Material</dt>
                    <dd className="max-w-[60%] text-right text-gray-700">
                      Acero
                    </dd>
                  </div>
                </dl>
              </div>

              {/* BOTÓN HABLEMOS con logo WhatsApp */}
              <a
                href={whatsappLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="pd-hero-info-block mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-cobalt/20 bg-white px-6 py-3 text-cobalt transition-all hover:border-cobalt/50 hover:bg-cobalt/5"
                style={monoStyle}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.46 1.34 4.97L2 22l5.2-1.36c1.46.79 3.1 1.21 4.79 1.21h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04C17.16 3.04 14.66 2 12.04 2zm0 18.16c-1.5 0-2.97-.4-4.25-1.16l-.3-.18-3.16.83.84-3.08-.2-.32a8.13 8.13 0 0 1-1.25-4.33c0-4.5 3.66-8.16 8.16-8.16 2.18 0 4.23.85 5.77 2.39a8.11 8.11 0 0 1 2.39 5.77c0 4.5-3.66 8.16-8.16 8.16zm4.47-6.11c-.24-.12-1.45-.72-1.67-.8-.22-.08-.39-.12-.55.12-.16.24-.63.8-.78.96-.14.16-.29.18-.53.06-.24-.12-1.03-.38-1.97-1.21-.73-.65-1.22-1.45-1.36-1.69-.14-.24-.02-.37.1-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.47-.01-.16 0-.43.06-.65.3-.22.24-.85.83-.85 2.03 0 1.2.87 2.36.99 2.52.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z" />
                </svg>
                <span className="text-[12px] uppercase tracking-[0.2em]">
                  Hablemos
                </span>
              </a>
            </aside>
          </div>
        </div>

        {/* Gradient fade hero white → siguiente sección cobalt */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 md:h-40"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(50,54,183,0.15) 60%, rgba(50,54,183,1) 100%)",
          }}
        />
      </section>

      {/* ═══════════════════ SPECS COMPLETOS bg-COBALT (invertido) ═══ */}
      <section className="pd-specs-section relative bg-cobalt text-cream">
        {/* Top fade entrante (continuidad con el gradient del hero) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 md:h-32"
          style={{
            background:
              "linear-gradient(to top, rgba(50,54,183,0) 0%, rgba(50,54,183,0.5) 50%, rgba(50,54,183,1) 100%)",
          }}
        />

        <div className="relative mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28">
          <div className="mb-10 flex items-end justify-between border-b border-cream/15 pb-6">
            <h2
              className="text-cream"
              style={{
                ...displayStyle,
                fontSize: "clamp(1.5rem, 2.4vw, 2.5rem)",
                lineHeight: 0.95,
              }}
            >
              Ficha técnica
            </h2>
            <p
              className="text-[10px] uppercase tracking-[0.35em] text-cream/55"
              style={monoStyle}
            >
              N°{product.code}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-12">
            <SpecDark
              label="Dimensiones"
              value={product.totalSize}
              className="pd-spec"
            />
            <SpecDark
              label="Área del arte"
              value={product.artSize}
              className="pd-spec"
            />
            <SpecDark
              label="Materiales"
              value={product.materials}
              className="pd-spec"
            />
            <SpecDark
              label="Pintura"
              value={product.paint}
              className="pd-spec"
            />
          </div>

          {product.notes && (
            <p
              className="pd-spec mt-10 max-w-[68ch] text-xs leading-relaxed text-cream/65"
              style={monoStyle}
            >
              <span
                className="mr-2 text-[9px] uppercase tracking-[0.3em] text-cream/45"
                style={monoStyle}
              >
                Nota
              </span>
              {product.notes}
            </p>
          )}
        </div>

        {/* Bottom fade saliente → blanco (para el resto de la página) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 md:h-32"
          style={{
            background:
              "linear-gradient(to bottom, rgba(50,54,183,0) 0%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,1) 100%)",
          }}
        />
      </section>
    </article>
  );
}

// ╔════════════════════════════════════════════════════════════════════╗
// ║  Pill Add Button — ovalado, cobalt, glow blanco neón, magnetic     ║
// ║  con rango EXTENDIDO (250px) — el botón se atrae desde más lejos.  ║
// ╚════════════════════════════════════════════════════════════════════╝

function PillAddButton({
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

  // Magnetic con rango EXTENDIDO — listener en window, distance fall-off
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 250; // percibe el cursor desde 250px
      if (distance < maxDistance) {
        const strength = Math.pow(1 - distance / maxDistance, 1.5) * 0.45;
        setPos({ x: dx * strength, y: dy * strength });
      } else {
        setPos({ x: 0, y: 0 });
      }
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

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
    stiffness: 180,
    damping: 16,
    mass: 0.6,
  };

  return (
    <motion.button
      ref={btnRef}
      type="button"
      onClick={handleClick}
      animate={pos}
      transition={transition}
      data-cursor="hover"
      className={cn(
        "relative inline-flex items-center justify-center rounded-full px-6 py-4 md:px-8 md:py-5",
        justAdded ? "bg-[#06d6a0] text-cobalt" : "bg-cobalt text-cream",
      )}
      style={{
        // Glow blanco neón detrás del botón (white halo expansive)
        boxShadow: justAdded
          ? "0 0 32px 4px rgba(6,214,160,0.45), 0 6px 18px rgba(0,0,0,0.15)"
          : "0 0 36px 6px rgba(255,255,255,0.55), 0 0 14px 2px rgba(255,255,255,0.4), 0 8px 22px rgba(50,54,183,0.35), inset 0 0 0 1px rgba(255,255,255,0.15)",
        fontFamily: '"Satoshi", system-ui, sans-serif',
      }}
      aria-label={`Agregar ${product.name} al carrito`}
    >
      <motion.span
        className="relative z-10 flex items-center gap-2 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.18em] md:text-[13px]"
        animate={{ x: pos.x * 0.5, y: pos.y * 0.5 }}
        transition={transition}
      >
        {justAdded ? (
          <>✓ Agregado al carrito</>
        ) : (
          <>
            <span>Agregar al carrito</span>
            <span aria-hidden className="text-cream/70">
              →
            </span>
          </>
        )}
      </motion.span>

      {selectedColor && !justAdded && (
        <span
          aria-hidden
          className="absolute -right-1 -top-1 block h-5 w-5 rounded-full border-2 border-white shadow-md"
          style={{ backgroundColor: selectedColor.hex }}
        />
      )}
    </motion.button>
  );
}

// ╔════════════════════════════════════════════════════════════════════╗
// ║  Premium Seal — pill ovalado outline cobalt con texto rotando      ║
// ║  Posicionado sobre la foto del producto. Decorativo + premium.     ║
// ╚════════════════════════════════════════════════════════════════════╝

function PremiumSeal({ msgIdx }: { msgIdx: number }) {
  return (
    // DENTRO de la foto (no fuera) — top-right corner con padding
    <div className="absolute right-3 top-3 z-30 md:right-6 md:top-6">
      <div
        className="relative inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 backdrop-blur-md md:gap-3 md:px-5 md:py-2.5"
        style={{
          border: "1.5px solid rgba(50,54,183,0.30)",
          boxShadow:
            "0 0 28px 4px rgba(255,255,255,0.6), 0 0 0 4px rgba(255,255,255,0.4), 0 6px 18px rgba(50,54,183,0.18)",
        }}
      >
        <span
          aria-hidden
          className="text-[12px] leading-none text-cobalt/70 md:text-[14px]"
        >
          ✦
        </span>
        <div className="flex h-4 min-w-[110px] items-center justify-center md:h-5 md:min-w-[130px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIdx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.18em] text-cobalt md:text-[10px] md:tracking-[0.2em]"
              style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
            >
              {ROTATING_PILLARS[msgIdx]}
            </motion.p>
          </AnimatePresence>
        </div>
        <span
          aria-hidden
          className="text-[12px] leading-none text-cobalt/70 md:text-[14px]"
        >
          ✦
        </span>
      </div>
    </div>
  );
}

// Spec con color cream sobre fondo cobalt
function SpecDark({
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
        className="mb-2 text-[9px] uppercase tracking-[0.3em] text-cream/50"
        style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
      >
        {label}
      </p>
      <p className="text-sm leading-snug text-cream md:text-base">{value}</p>
    </div>
  );
}
