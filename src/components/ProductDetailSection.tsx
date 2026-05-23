"use client";

import { useState } from "react";
import { ProductGallery } from "./ProductGallery";
import { ColorPicker } from "./ColorPicker";
import { AddToCartButton } from "./AddToCartButton";
import { WhatsAppButton } from "./WhatsAppButton";
import type { Product } from "@/data/products";
import type { Color } from "@/data/colors";
import { whatsappLink } from "@/lib/utils";

type Props = {
  product: Product;
  colorPrefix?: string;
};

/**
 * Detalle de producto - estetica editorial-tecnica.
 * Layout vertical en bloques (hero / specs / color / CTA) en lugar de
 * el split 2-col sticky tipico de ecommerce. Tipografia: Bagel para
 * titles, Satoshi mono para labels y datos.
 */
export function ProductDetailSection({ product, colorPrefix }: Props) {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  const dynamicHero =
    colorPrefix && selectedColor
      ? `/img/products/colors/${colorPrefix}-${selectedColor.id}.jpg`
      : product.hero;

  const message = `Hola MUFFMENT, quiero el ${product.name}${selectedColor ? ` en color ${selectedColor.name}` : ""} (${product.priceLabel}). ¿Me ayudas con la cotización?`;

  const monoStyle = { fontFamily: '"Satoshi", system-ui, sans-serif' };
  const displayStyle = { fontFamily: "var(--font-bagel)" };

  return (
    <article className="mx-auto max-w-[1600px] px-6 md:px-12">
      {/* ━━━━━━━━━━━━ HERO BLOCK ━━━━━━━━━━━━ */}
      <section className="grid gap-12 pb-16 md:grid-cols-12 md:gap-x-16 md:pb-24">
        {/* IZQUIERDA: meta + título + descripción + CTA */}
        <div className="md:col-span-6">
          {/* Meta superior: tipo / código / unidad */}
          <div className="mb-8 grid grid-cols-3 gap-4 border-b border-cobalt/15 pb-4">
            <Meta label="Cat" value={product.categoryLabel.split(" ").pop() ?? ""} />
            <Meta label="Cód" value={`N°${product.code}`} />
            <Meta label="Tipo" value="Pieza única" />
          </div>

          {/* Título imponente */}
          <h1
            className="text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.92] tracking-tight text-cobalt"
            style={displayStyle}
          >
            {product.name}
          </h1>

          {/* Descripción */}
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-cobalt/80 md:text-xl">
            {product.description}
          </p>

          {/* Precio + color seleccionado en bloque técnico */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-cobalt/55" style={monoStyle}>
                Valor
              </p>
              <p
                className="mt-2 text-5xl text-cobalt tabular-nums md:text-6xl"
                style={displayStyle}
              >
                {product.priceLabel}
              </p>
              {product.priceEstimated && (
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-cobalt/55" style={monoStyle}>
                  desde · final según diseño
                </p>
              )}
            </div>

            {selectedColor ? (
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-cobalt/55" style={monoStyle}>
                  Color seleccionado
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="block h-12 w-12 shrink-0 rounded-full border border-cobalt/10 shadow-sm"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <div>
                    <p className="text-xl text-cobalt" style={displayStyle}>
                      {selectedColor.name}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-cobalt/55" style={monoStyle}>
                      ZMK · {selectedColor.id}
                    </p>
                  </div>
                </div>
              </div>
            ) : colorPrefix ? (
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-cobalt/55" style={monoStyle}>
                  Color
                </p>
                <p className="mt-2 text-sm text-cobalt/65">
                  Sin color · escogé abajo entre 88 tonos
                </p>
              </div>
            ) : null}
          </div>

          {/* CTA stack */}
          <div className="mt-10 space-y-3">
            <AddToCartButton product={product} selectedColor={selectedColor} />
            <div className="grid gap-3 sm:grid-cols-2">
              <WhatsAppButton message={message} size="lg">
                Preguntar
              </WhatsAppButton>
              <a
                href={whatsappLink(
                  `Hola MUFFMENT, quiero el ${product.name} pero a la medida. ¿Cómo cotizamos?`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="inline-flex items-center justify-center rounded-full border border-cobalt/30 px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] text-cobalt transition-colors hover:border-cobalt hover:bg-cobalt hover:text-cream"
                style={monoStyle}
              >
                A la medida
              </a>
            </div>
          </div>

          {/* Despacho + garantia inline */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.25em] text-cobalt/55" style={monoStyle}>
            <span className="flex items-center gap-2">
              <span className="inline-block h-1 w-1 rounded-full bg-cobalt/55" />
              Bajo pedido · 4 sem
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-1 w-1 rounded-full bg-cobalt/55" />
              Garantía 3 años
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-1 w-1 rounded-full bg-cobalt/55" />
              Hecho en Colombia
            </span>
          </div>
        </div>

        {/* DERECHA: galería */}
        <div className="md:col-span-6">
          <ProductGallery
            hero={dynamicHero}
            gallery={product.gallery}
            video={product.video}
            alt={product.name}
            fallbackCode={product.code}
            fallbackName={product.shortName}
          />
        </div>
      </section>

      {/* ━━━━━━━━━━━━ SPECS DATASHEET ━━━━━━━━━━━━ */}
      <section className="border-t border-cobalt/15 py-16 md:py-24">
        <div className="mb-10 flex items-baseline justify-between">
          <h2
            className="text-[clamp(1.5rem,3vw,2.5rem)] leading-none tracking-tight text-cobalt"
            style={displayStyle}
          >
            Specs
          </h2>
          <span className="text-[10px] uppercase tracking-[0.3em] text-cobalt/45" style={monoStyle}>
            Datasheet · {product.code}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          <Spec label="Dimensiones totales" value={product.totalSize} />
          <Spec label="Dimensiones del arte" value={product.artSize} />
          <Spec label="Materiales" value={product.materials} />
          <Spec label="Pintura" value={product.paint} />
        </div>

        {product.notes && (
          <p className="mt-10 max-w-[60ch] border-l-2 border-cobalt/30 pl-4 text-sm text-cobalt/75">
            <span className="mr-2 text-[10px] uppercase tracking-[0.3em] text-cobalt/55" style={monoStyle}>
              Nota
            </span>
            {product.notes}
          </p>
        )}
      </section>

      {/* ━━━━━━━━━━━━ COLOR PICKER FULL WIDTH ━━━━━━━━━━━━ */}
      {colorPrefix && (
        <section className="border-t border-cobalt/15 py-16 md:py-24">
          <div className="mb-10 flex items-baseline justify-between">
            <h2
              className="text-[clamp(1.5rem,3vw,2.5rem)] leading-none tracking-tight text-cobalt"
              style={displayStyle}
            >
              Escogé tu color
            </h2>
            <span className="text-[10px] uppercase tracking-[0.3em] text-cobalt/45" style={monoStyle}>
              ZMK · 88 tonos
            </span>
          </div>

          <div className="grid gap-12 md:grid-cols-12 md:gap-x-16">
            <div className="md:col-span-7">
              <ColorPicker
                selectedId={selectedColor?.id ?? null}
                onSelect={setSelectedColor}
              />
            </div>
            <div className="md:col-span-5">
              <p className="text-sm leading-relaxed text-cobalt/70 md:text-base">
                Carta industrial ZMK. Cada color es{" "}
                <strong className="text-cobalt">pintura electrostática en polvo</strong>{" "}
                aplicada y horneada en nuestro taller.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-cobalt/65 md:text-base">
                Acabados disponibles: brillante, mate, semi-mate, texturizado,
                microtexturizado, con destellos. Cada bolita arriba muestra la
                textura real del acabado.
              </p>
              <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-cobalt/45" style={monoStyle}>
                ¿No ves tu color? Cotizamos colores especiales por WhatsApp.
              </p>
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────
function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        className="text-[9px] uppercase tracking-[0.3em] text-cobalt/45"
        style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
      >
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-cobalt">{value}</p>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        className="mb-3 text-[10px] uppercase tracking-[0.3em] text-cobalt/50"
        style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
      >
        {label}
      </p>
      <p className="text-base leading-snug text-cobalt md:text-lg">{value}</p>
    </div>
  );
}
