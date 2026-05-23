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
 * Product Detail v6 — HERO CINEMATOGRÁFICO Musotoku.
 *
 * Después de iterar mucho, Jon mandó el screenshot REAL del hero de
 * Musotoku — fondo dark con producto monumental centrado y tipografía
 * vertical decorativa a los lados. Esto es lo que hago ahora.
 *
 *  ┌─────────────────────────────────────────────────────┐
 *  │ [LOGO]    nav…                          [Hablemos]  │
 *  │                                                      │
 *  │ ┃ H                              H ┃                 │  ← Tipografía
 *  │ ┃ A                              A ┃                 │    vertical
 *  │ ┃ B    ╔═══════════════╗         B ┃                 │    lateral
 *  │ ┃ L    ║                ║         L ┃                 │    repetida
 *  │ ┃ A    ║   PRODUCTO     ║   ●AGRG A ┃                 │    en ambos
 *  │ ┃ D    ║   GIGANTE      ║         D ┃                 │    lados
 *  │ ┃ O    ║                ║         O ┃                 │
 *  │ ┃ R    ╚═══════════════╝         R ┃                 │
 *  │                                                      │
 *  │             [DESDE $780K]   [colores ◌◌◌◌◌]         │
 *  └─────────────────────────────────────────────────────┘
 *  ↓ scroll: info + specs detallados sobre cream
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

  // Tipografía vertical lateral — el nombre del producto en uppercase,
  // repetido para llenar el alto. Usa el shortName si está disponible.
  const verticalTitle = (product.shortName ?? product.name).toUpperCase();

  useGSAP(
    () => {
      gsap.from(".pd-vertical-title", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: "expo.out",
        delay: 0.3,
      });
      gsap.from(".pd-hero-photo", {
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: "expo.out",
        delay: 0.1,
      });
      gsap.from(".pd-hero-cta-circle", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: 0.7,
      });
      gsap.from(".pd-meta-block", {
        opacity: 0,
        y: 20,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.5,
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
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO CINEMATOGRÁFICO — fondo cobalt, producto monumental         */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden bg-cobalt text-cream"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 60%)",
        }}
      >
        {/* Tipografía vertical lateral IZQUIERDA */}
        <div
          aria-hidden
          className="pd-vertical-title pointer-events-none absolute inset-y-0 left-0 z-10 hidden md:flex md:w-[8vw] md:items-center md:justify-center md:overflow-hidden"
        >
          <p
            className="whitespace-nowrap text-cream/15"
            style={{
              ...displayStyle,
              fontSize: "clamp(2.5rem, 6vw, 6.5rem)",
              lineHeight: 0.9,
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              letterSpacing: "-0.02em",
            }}
          >
            {verticalTitle} · {verticalTitle} · {verticalTitle}
          </p>
        </div>

        {/* Tipografía vertical lateral DERECHA */}
        <div
          aria-hidden
          className="pd-vertical-title pointer-events-none absolute inset-y-0 right-0 z-10 hidden md:flex md:w-[8vw] md:items-center md:justify-center md:overflow-hidden"
        >
          <p
            className="whitespace-nowrap text-cream/15"
            style={{
              ...displayStyle,
              fontSize: "clamp(2.5rem, 6vw, 6.5rem)",
              lineHeight: 0.9,
              writingMode: "vertical-rl",
              letterSpacing: "-0.02em",
            }}
          >
            {verticalTitle} · {verticalTitle} · {verticalTitle}
          </p>
        </div>

        {/* Eyebrow técnico — esquina superior izquierda */}
        <div className="relative z-20 mx-auto flex max-w-[1600px] items-start justify-between px-6 pt-6 md:px-12 md:pt-10">
          <p
            className="text-[10px] uppercase tracking-[0.35em] text-cream/70"
            style={monoStyle}
          >
            {product.categoryLabel} · N°{product.code}
          </p>
          <p
            className="text-[10px] uppercase tracking-[0.35em] text-cream/70"
            style={monoStyle}
          >
            MUFFMENT
          </p>
        </div>

        {/* PRODUCTO MONUMENTAL CENTRADO + CTA flotante */}
        <div className="relative z-20 mx-auto flex max-w-[1600px] flex-col items-center justify-center px-6 pb-12 pt-6 md:px-12 md:pb-20 md:pt-10">
          <div className="pd-hero-photo relative flex w-full items-center justify-center">
            {/* Wrapper del producto — WHITE FRAME para que la foto se vea
                con sus colores reales (sin desaturarlos por blend modes)
                contra el bg cobalt cinematográfico. Sombra dramatic. */}
            <div
              className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white"
              style={{
                maxWidth: "min(72vh, 760px)",
                boxShadow:
                  "0 50px 90px -10px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
              }}
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
                    sizes="(max-width: 768px) 90vw, 720px"
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              {/* CTA circular flotante grande — estilo botón "VIEW" verde
                  de Musotoku, pero AGREGAR en MUFFMENT */}
              <div className="pd-hero-cta-circle absolute -right-2 top-1/2 z-30 -translate-y-1/2 md:right-0">
                <CircleAddButton
                  product={product}
                  selectedColor={selectedColor}
                />
              </div>
            </div>
          </div>

          {/* Bloque meta inferior — precio + selling points + indicadores */}
          <div className="relative z-20 mt-10 grid w-full max-w-[900px] grid-cols-1 gap-6 md:mt-14 md:grid-cols-3 md:gap-8">
            <div className="pd-meta-block">
              <p
                className="text-[10px] uppercase tracking-[0.3em] text-cream/55"
                style={monoStyle}
              >
                Desde
              </p>
              <p
                className="mt-1 leading-none tabular-nums text-cream"
                style={{
                  ...displayStyle,
                  fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
                }}
              >
                {product.priceLabel}
              </p>
            </div>

            <div className="pd-meta-block md:text-center">
              <p
                className="text-[10px] uppercase tracking-[0.3em] text-cream/55"
                style={monoStyle}
              >
                Producto
              </p>
              <h1
                className="mt-1 leading-[0.95] text-cream"
                style={{
                  ...displayStyle,
                  fontSize: "clamp(1.5rem, 2.4vw, 2.25rem)",
                }}
              >
                {product.name}
              </h1>
            </div>

            <div className="pd-meta-block md:text-right">
              <p
                className="text-[10px] uppercase tracking-[0.3em] text-cream/55"
                style={monoStyle}
              >
                Disponible
              </p>
              <p
                className="mt-1 text-cream"
                style={{
                  ...displayStyle,
                  fontSize: "clamp(1.5rem, 2.4vw, 2.25rem)",
                  lineHeight: 0.95,
                }}
              >
                + de 90 colores
              </p>
            </div>
          </div>

          {/* Thumbnails carousel si hay multiples fotos */}
          {images.length > 1 && (
            <div className="pd-meta-block mt-8 flex gap-2 overflow-x-auto">
              {images.map((src, i) => (
                <button
                  key={`${i}-${src}`}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  data-cursor="hover"
                  aria-label={`Imagen ${i + 1}`}
                  aria-pressed={i === activeIdx}
                  className={cn(
                    "relative aspect-square w-16 shrink-0 overflow-hidden rounded-md border bg-white/95 transition-all",
                    i === activeIdx
                      ? "border-cream opacity-100"
                      : "border-cream/20 opacity-55 hover:opacity-100",
                  )}
                >
                  <Image
                    src={src}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    sizes="64px"
                    className="object-contain"
                    style={{ mixBlendMode: "multiply" }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SECCIÓN INFO — bg cream, layout 2-col con sticky rail            */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-16">
            {/* COL IZQUIERDA — descripción editorial */}
            <div className="md:col-span-7">
              <p
                className="text-[10px] uppercase tracking-[0.3em] text-cobalt/55"
                style={monoStyle}
              >
                Sobre este aviso
              </p>
              <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-cobalt/85 md:text-[18px] md:leading-[1.6]">
                {product.description}
              </p>

              {/* Selling points como featured-list */}
              <ul
                className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3"
                style={monoStyle}
              >
                <SellingPoint label="Bajo pedido" value="4 semanas" />
                <SellingPoint label="Garantía" value="3 años" />
                <SellingPoint label="Origen" value="Hecho en Colombia" />
              </ul>

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

            {/* COL DERECHA STICKY — color picker + CTA */}
            <aside className="md:col-span-5">
              <div className="md:sticky md:top-28 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto md:pb-6 md:pt-1 md:pr-1 md:[scrollbar-width:thin]">
                {colorPrefix && (
                  <div>
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
                )}
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

// ╔═══════════════════════════════════════════════════════════════════╗
// ║  Circle Add Button — el "VIEW verde" de Musotoku, AGREGAR.        ║
// ╚═══════════════════════════════════════════════════════════════════╝

function CircleAddButton({
  product,
  selectedColor,
}: {
  product: Product;
  selectedColor: Color | null;
}) {
  // Lo embebemos como wrapper around AddToCartButton estilo circular,
  // pero el botón normal del rail bottom es el "oficial" — este es
  // el "VIEW" visual flotante que invita al ojo.
  return (
    <div className="group relative">
      <a
        href="#agregar"
        onClick={(e) => {
          e.preventDefault();
          // Scroll a la sección de info+CTA
          document.querySelector("#agregar")?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }}
        data-cursor="hover"
        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#06d6a0] text-cobalt shadow-2xl transition-transform hover:scale-110 md:h-28 md:w-28"
        aria-label={`Agregar ${product.name} al carrito`}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-[0.25em] md:text-[11px]"
          style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
        >
          Agregar
        </span>
        {/* sparkle indicator si hay color seleccionado */}
        {selectedColor && (
          <span
            aria-hidden
            className="absolute -right-1 -top-1 block h-5 w-5 rounded-full border-2 border-cobalt"
            style={{ backgroundColor: selectedColor.hex }}
          />
        )}
      </a>
    </div>
  );
}

// ╔═══════════════════════════════════════════════════════════════════╗
// ║  Sub-componentes: SellingPoint, Spec                              ║
// ╚═══════════════════════════════════════════════════════════════════╝

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
