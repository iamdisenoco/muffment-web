"use client";

import { useRef, useState } from "react";
import { ColorPicker } from "./ColorPicker";
import { AddToCartButton } from "./AddToCartButton";
import { WhatsAppButton } from "./WhatsAppButton";
import { PremiumBadge } from "./PremiumBadge";
import { DragGallery } from "./DragGallery";
import { ProductScrollNarrative } from "./ProductScrollNarrative";
import type { Product } from "@/data/products";
import type { Color } from "@/data/colors";
import { cn } from "@/lib/utils";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  product: Product;
  colorPrefix?: string;
};

/**
 * Product Detail Hero v4 — feedback Jon "el producto debe ser el centro,
 * que la imagen se vea más imponente". Cambios respecto v3:
 *
 *   ❌ Quitado: eyebrow + título centrados que comían altura
 *   ❌ Quitado: title con character stagger reveal (movido al rail)
 *   ✓ La foto ocupa h-[calc(100vh - header - breadcrumb)] → dominante
 *   ✓ Eyebrow + título compactos viven en el rail izquierdo
 *   ✓ Color picker swatches más pequeñas (mini chips 11-col)
 *   ✓ Backdrop typography masiva se ve más DETRÁS del producto
 *
 *   ┌──────────────────────────────────────────────┐
 *   │ ┌─────┐   ┌──────────────────┐   ┌────────┐  │
 *   │ │CAT· │   │                  │   │COLOR   │  │
 *   │ │NAME │   │                  │   │PICKER  │  │
 *   │ │     │   │   [HUGE PRODUCT] │   │mini    │  │
 *   │ │$780K│   │   (fills height) │   │        │  │
 *   │ │desc │   │                  │   │        │  │
 *   │ │CTA  │   │                  │   │        │  │
 *   │ │meta │   │                  │   │        │  │
 *   │ └─────┘   └──────────────────┘   └────────┘  │
 *   └──────────────────────────────────────────────┘
 *
 * Todo entra en una vista (sin scroll para ver la foto entera).
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
  const hasMultiple = images.length > 1;

  const message = `Hola MUFFMENT, quiero el ${product.name}${selectedColor ? ` en color ${selectedColor.name}` : ""} (${product.priceLabel}). ¿Me ayudas con la cotización?`;

  const monoStyle = { fontFamily: '"Satoshi", system-ui, sans-serif' };
  const displayStyle = { fontFamily: "var(--font-bagel)" };

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
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // 3. Rail reveals — iniciales (stagger sutil al cargar la página)
      gsap.from(".pd-rail-item", {
        opacity: 0,
        y: 16,
        duration: 0.8,
        stagger: 0.07,
        ease: "power3.out",
        delay: 0.25,
      });

      // 4. Specs — reveal en scroll
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
    <article ref={containerRef} className="relative bg-white">
      {/* ═══════════════ HERO COMPACT — todo en 1 vista ═══════════════ */}
      <section className="relative overflow-hidden">
        {/* ─── BACKDROP TYPOGRAPHY GIANTE ─── */}
        {/* Vive detrás del grid (z-0). Tamaño relativo al viewport para que
            sea dominante en desktop pero no rompa mobile. */}
        <div
          aria-hidden
          className="pd-backdrop-type pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        >
          <h2
            className="select-none whitespace-nowrap text-center leading-[0.82] text-cobalt/[0.04] md:tracking-[-0.04em]"
            style={{
              ...displayStyle,
              fontSize: "clamp(6rem, 22vw, 26rem)",
            }}
          >
            {product.shortName.toUpperCase()}
          </h2>
        </div>

        <div
          className="relative z-10 mx-auto grid max-w-[1700px] items-center gap-6 px-4 pb-8 pt-2 md:grid-cols-12 md:gap-x-8 md:px-10 md:pb-12 md:pt-3"
          style={{
            // Altura objetivo: viewport menos header (pt-32 = 128px del
            // <main>) menos breadcrumb (~70px). Permite scroll si el
            // usuario quiere ver el resto, pero todo entra arriba.
            minHeight: "calc(100vh - 200px)",
          }}
        >
          {/* ══════════ COL IZQUIERDA — meta + precio + CTA ══════════ */}
          <aside className="space-y-4 md:col-span-3">
            {/* Eyebrow + nombre compacto del producto */}
            <div className="pd-rail-item">
              <p
                className="text-[10px] uppercase tracking-[0.35em] text-cobalt/55"
                style={monoStyle}
              >
                {product.categoryLabel} · N°{product.code}
              </p>
              <h1
                className="mt-1.5 leading-[0.95] tracking-tight text-cobalt"
                style={{
                  ...displayStyle,
                  fontSize: "clamp(1.5rem, 2vw, 2rem)",
                }}
              >
                {product.name}
              </h1>
            </div>

            {/* Precio */}
            <div className="pd-rail-item">
              <p
                className="text-[9px] uppercase tracking-[0.3em] text-cobalt/55"
                style={monoStyle}
              >
                Valor
              </p>
              <p
                className="text-3xl text-cobalt tabular-nums md:text-4xl"
                style={displayStyle}
              >
                {product.priceLabel}
              </p>
              {product.priceEstimated && (
                <p
                  className="text-[9px] uppercase tracking-[0.2em] text-cobalt/55"
                  style={monoStyle}
                >
                  desde · final según diseño
                </p>
              )}
            </div>

            {/* Descripción corta */}
            <p className="pd-rail-item text-[13px] leading-relaxed text-cobalt/75">
              {product.description}
            </p>

            {/* Selected color chip */}
            {selectedColor && (
              <div className="pd-rail-item flex items-center gap-2">
                <span
                  aria-hidden
                  className="block h-6 w-6 shrink-0 rounded-full border border-cobalt/10 shadow-sm"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <div>
                  <p
                    className="text-[8px] uppercase tracking-[0.25em] text-cobalt/55"
                    style={monoStyle}
                  >
                    Color
                  </p>
                  <p
                    className="text-[13px] leading-tight text-cobalt"
                    style={displayStyle}
                  >
                    {selectedColor.name}
                  </p>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="pd-rail-item space-y-2">
              <AddToCartButton
                product={product}
                selectedColor={selectedColor}
              />
              <WhatsAppButton message={message} size="md" variant="ghost">
                Preguntar
              </WhatsAppButton>
            </div>

            {/* Meta dots */}
            <div
              className="pd-rail-item flex flex-col gap-1 text-[9px] uppercase tracking-[0.22em] text-cobalt/55"
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
          </aside>

          {/* ══════════ COL CENTRAL — FOTO DOMINANTE ══════════ */}
          <div
            className={cn(
              "relative flex h-full items-center justify-center",
              colorPrefix ? "md:col-span-6" : "md:col-span-9",
            )}
          >
            {/* Premium badge — esquina sup derecha sobre la foto */}
            <div className="pd-rail-item absolute right-0 top-0 z-30 hidden md:block">
              <PremiumBadge />
            </div>

            {/* Wrapper del photo que ocupa toda la altura disponible */}
            <div
              className="pd-hero-photo relative flex h-full w-full items-center justify-center"
              style={{
                // Foto MUCHO más grande — calc para que no se desborde
                minHeight: "min(70vh, 720px)",
              }}
            >
              <DragGallery
                images={images}
                alt={product.name}
                index={imgIdx}
                onChange={setImgIdx}
              />
            </div>
          </div>

          {/* ══════════ COL DERECHA — COLOR PICKER MINI ══════════ */}
          {colorPrefix && (
            <aside className="pd-rail-item md:col-span-3">
              <p
                className="text-[9px] uppercase tracking-[0.3em] text-cobalt/55"
                style={monoStyle}
              >
                Escogé tu color
              </p>
              <p
                className="mt-0.5 mb-3 text-[10px] text-cobalt/60"
                style={monoStyle}
              >
                + de 90 · pintura electrostática
              </p>
              <ColorPicker
                selectedId={selectedColor?.id ?? null}
                onSelect={setSelectedColor}
              />
            </aside>
          )}
        </div>

        {/* Dots + Premium badge mobile (debajo del grid) */}
        {(hasMultiple || true) && (
          <div className="relative z-10 mx-auto max-w-[1700px] px-4 pb-6 md:px-10">
            {hasMultiple && (
              <div className="flex items-center justify-center gap-1.5">
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
            <div className="mt-4 flex justify-center md:hidden">
              <PremiumBadge />
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════ SCROLL-NARRATIVE PINNED ═══════════════════ */}
      <ProductScrollNarrative
        product={product}
        heroOverride={dynamicHero}
      />

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
