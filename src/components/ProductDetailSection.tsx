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

type Props = {
  product: Product;
  colorPrefix?: string;
};

/**
 * Product Detail v7 — MUSOTOKU REAL (después de leer CSS source).
 *
 * Estructura faithful al referente:
 *   - bg-black full screen
 *   - SIDEBAR fixed right con logo MUFFMENT repetido vertical (7x)
 *   - Producto absolute left:20% width:60% (centered, dominante)
 *   - Content absolute bottom:4rem:
 *       cabecera "DISEÑADO PARA DURAR" (1rem bold uppercase)
 *       marquee horizontal con border-top + border-bottom
 *         · nombre producto + ✦ repetido animado
 *       button-round VERDE FLUO en intersección right del marquee
 *         (top:100% translateY(-50%) → cortado por el border-bottom)
 *
 * Debajo: sección bg-white con info detallada + color picker sticky.
 */
export function ProductDetailSection({ product, colorPrefix }: Props) {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

  const dynamicHero =
    colorPrefix && selectedColor
      ? `/img/products/colors/${colorPrefix}-${selectedColor.id}.jpg`
      : product.hero;

  const images = [dynamicHero, ...(product.gallery ?? [])];
  const activeImg = images[activeIdx] ?? images[0];

  const message = `Hola MUFFMENT, quiero el ${product.name}${selectedColor ? ` en color ${selectedColor.name}` : ""} (${product.priceLabel}). ¿Me ayudas con la cotización?`;

  const monoStyle = { fontFamily: '"Satoshi", system-ui, sans-serif' };
  const displayStyle = { fontFamily: "var(--font-bagel)" };

  // El nombre del producto para el marquee — uppercase, repetido N veces
  // separado por el sparkle ✦ entre cada repetición.
  const marqueeName = product.name.toUpperCase();

  useGSAP(
    () => {
      gsap.from(".pd-hero-photo", {
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: "expo.out",
      });
      gsap.from(".pd-hero-cabecera", {
        opacity: 0,
        y: 20,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.4,
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
      gsap.from(".pd-sidebar-logo", {
        opacity: 0,
        x: 30,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.3,
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
    <article ref={containerRef} className="relative">
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO MUSOTOKU-STYLE — bg negro, full-screen feel                 */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden bg-black text-white"
        style={{
          // Altura: viewport menos el header global (pt-32 del main) y
          // breadcrumb. Da sensación cinematográfica sin romper layout.
          minHeight: "calc(100vh - 180px)",
        }}
      >
        {/* ───── SIDEBAR fixed right con logo MUFFMENT repetido vertical ───── */}
        <aside
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-[5rem] flex-col items-center justify-center gap-3 border-l border-[#06d6a0]/50 bg-black px-3 md:flex"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="pd-sidebar-logo relative h-12 w-12 opacity-80"
            >
              <Image
                src="/logos/muffment-icon-cream.svg"
                alt=""
                fill
                sizes="48px"
                className="object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
                aria-hidden
              />
            </div>
          ))}
        </aside>

        {/* ───── FOTO PRODUCTO centered (absolute left:20% width:60%) ───── */}
        <div
          className="pd-hero-photo absolute z-10 flex items-center justify-center md:left-[20%] md:right-[6rem] md:top-0 md:h-full"
          style={{
            // Mobile: relative + auto sizing; desktop: absolute left:20%
            // (la fórmula real de Musotoku es left:20% width:60%, pero
            // con sidebar 5rem a la derecha la width efectiva es ~62%).
          }}
        >
          <div
            className="relative aspect-square w-[88vw] max-w-[640px] md:h-[80%] md:max-h-[680px] md:w-[80%] md:max-w-[680px]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImg}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.21, 0.6, 0.35, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={activeImg}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 88vw, 680px"
                  className="object-contain"
                  style={{
                    // La foto cinematográfica AI-generated ya viene con
                    // su propio fondo silk dark, no necesita blend mode.
                    // Solo drop-shadow sutil para sumar profundidad al
                    // espacio entre la foto y el bg negro de la página.
                    filter:
                      "drop-shadow(0 40px 80px rgba(0,0,0,0.5))",
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile: imagen primero (relative, no absolute) */}
        <div className="pd-hero-photo relative z-10 flex items-center justify-center pt-8 md:hidden">
          <div className="relative aspect-square w-[88vw] max-w-[500px]">
            <Image
              src={activeImg}
              alt={product.name}
              fill
              priority
              sizes="88vw"
              className="object-contain"
              style={{
                filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.5))",
              }}
            />
          </div>
        </div>

        {/* ───── CONTENT ABSOLUTE BOTTOM (cabecera + marquee + button) ───── */}
        <div className="relative z-20 mx-auto w-full max-w-[1440px] px-6 pb-8 pt-8 md:absolute md:bottom-12 md:left-0 md:right-[5rem] md:px-12 md:pb-0 md:pt-0">
          {/* Cabecera small */}
          <p
            className="pd-hero-cabecera text-xs font-bold uppercase tracking-[0.2em] text-white md:text-sm"
            style={monoStyle}
          >
            Diseñado para durar
          </p>

          {/* MARQUEE horizontal con border-top + border-bottom */}
          <div
            className="pd-hero-marquee relative mt-3 border-y border-white/70 py-4 md:mt-4 md:py-5"
            style={{
              overflow: "visible",
            }}
          >
            <div
              className="muff-marquee flex w-fit items-center whitespace-nowrap"
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
                      fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {marqueeName}
                  </span>
                  <span
                    aria-hidden
                    className="ml-8 text-white/70"
                    style={{
                      fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                    }}
                  >
                    ✦
                  </span>
                </span>
              ))}
            </div>

            {/* BUTTON-ROUND verde fluo en intersección right del marquee.
                Position absolute right top:100% translateY(-50%) → cortado
                por el border-bottom (clavado replicate del CSS Musotoku) */}
            <a
              href="#agregar"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#agregar")?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }}
              data-cursor="hover"
              className="pd-hero-button absolute z-30 flex items-center justify-center rounded-full bg-[#06d6a0] text-black shadow-2xl transition-transform hover:scale-110"
              style={{
                right: "0.5rem",
                top: "100%",
                transform: "translateY(-50%)",
                width: "5.5rem",
                height: "5.5rem",
                fontFamily: '"Satoshi", system-ui, sans-serif',
              }}
              aria-label={`Agregar ${product.name} al carrito`}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
                Agregar
              </span>
            </a>
          </div>

          {/* Pequeño footer info: progress + breadcrumb-style */}
          <div
            className="mt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/60 md:mt-8"
            style={monoStyle}
          >
            <span>
              {product.categoryLabel} · N°{product.code}
            </span>
            <span>{product.priceLabel}</span>
          </div>
        </div>

      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SECCIÓN INFO — bg blanco, 2-col con sticky rail                  */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-16">
            {/* COL IZQUIERDA — descripción + selling points */}
            <div className="md:col-span-7">
              <p
                className="text-[10px] uppercase tracking-[0.3em] text-cobalt/55"
                style={monoStyle}
              >
                Sobre este aviso
              </p>
              <h2
                className="mt-3 leading-[0.95] tracking-tight text-cobalt"
                style={{
                  ...displayStyle,
                  fontSize: "clamp(2rem, 3.4vw, 3.5rem)",
                }}
              >
                {product.name}
              </h2>
              <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-cobalt/85 md:text-[18px] md:leading-[1.6]">
                {product.description}
              </p>

              <ul
                className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3"
                style={monoStyle}
              >
                <SellingPoint label="Bajo pedido" value="4 semanas" />
                <SellingPoint label="Garantía" value="3 años" />
                <SellingPoint label="Origen" value="Hecho en Colombia" />
              </ul>

              {/* Thumbnails extra si hay multiples fotos */}
              {images.length > 1 && (
                <div className="mt-10">
                  <p
                    className="mb-3 text-[10px] uppercase tracking-[0.3em] text-cobalt/55"
                    style={monoStyle}
                  >
                    Galería
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {images.map((src, i) => (
                      <button
                        key={`${i}-${src}`}
                        type="button"
                        onClick={() => setActiveIdx(i)}
                        data-cursor="hover"
                        aria-label={`Imagen ${i + 1}`}
                        aria-pressed={i === activeIdx}
                        className={cn(
                          "relative aspect-square w-24 shrink-0 overflow-hidden rounded-md border bg-white transition-all",
                          i === activeIdx
                            ? "border-cobalt opacity-100"
                            : "border-cobalt/15 opacity-65 hover:opacity-100 hover:border-cobalt/40",
                        )}
                      >
                        <Image
                          src={src}
                          alt={`${product.name} ${i + 1}`}
                          fill
                          sizes="96px"
                          className="object-contain"
                          style={{ mixBlendMode: "multiply" }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.notes && (
                <p
                  className="mt-8 max-w-[68ch] text-xs leading-relaxed text-cobalt/65"
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

            {/* COL DERECHA STICKY — precio + color picker + CTA */}
            <aside className="md:col-span-5">
              <div className="md:sticky md:top-28 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto md:pb-6 md:pt-1 md:pr-1 md:[scrollbar-width:thin]">
                <p
                  className="text-[10px] uppercase tracking-[0.3em] text-cobalt/55"
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

                {colorPrefix && (
                  <div className="mt-7">
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
                        + de 90
                      </p>
                    </div>

                    {selectedColor && (
                      <div className="mb-3 flex items-center gap-2">
                        <span
                          aria-hidden
                          className="block h-4 w-4 shrink-0 rounded-full border border-cobalt/15"
                          style={{ backgroundColor: selectedColor.hex }}
                        />
                        <p
                          className="text-[11px] text-cobalt"
                          style={monoStyle}
                        >
                          <span className="text-cobalt/55">Seleccionado:</span>{" "}
                          <span className="font-medium">
                            {selectedColor.name}
                          </span>
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

                <div
                  id="agregar"
                  className="mt-6 border-t border-cobalt/10 pt-5"
                >
                  <AddToCartButton
                    product={product}
                    selectedColor={selectedColor}
                  />
                  <a
                    href={whatsappLink(message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="mt-3 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-cobalt/65 transition-colors hover:text-cobalt"
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
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SPECS TÉCNICAS ═══════════════════ */}
      <section className="pd-specs-section bg-white">
        <div className="mx-auto max-w-[1600px] px-6 pb-24 md:px-12 md:pb-32">
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
        </div>
      </section>
    </article>
  );
}

function SellingPoint({ label, value }: { label: string; value: string }) {
  return (
    <li className="border-l-2 border-cobalt/20 pl-4">
      <p
        className="text-[9px] uppercase tracking-[0.3em] text-cobalt/55"
        style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
      >
        {label}
      </p>
      <p
        className="mt-1 text-sm text-cobalt md:text-base"
        style={{ fontFamily: "var(--font-bagel)" }}
      >
        {value}
      </p>
    </li>
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
