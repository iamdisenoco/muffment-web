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
 * Sección detalle del producto: maneja state del color seleccionado y
 * conecta el ColorPicker con el AddToCartButton (para que el carrito
 * registre el color elegido).
 */
export function ProductDetailSection({ product, colorPrefix }: Props) {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  const dynamicHero =
    colorPrefix && selectedColor
      ? `/img/products/colors/${colorPrefix}-${selectedColor.id}.jpg`
      : product.hero;

  const message = `Hola MUFFMENT, quiero el ${product.name}${selectedColor ? ` en color ${selectedColor.name}` : ""} (${product.priceLabel}). ¿Me ayudas con la cotización?`;

  return (
    <section className="mx-auto mt-8 grid max-w-[1600px] gap-10 px-6 pb-24 md:grid-cols-12 md:gap-16 md:px-10 md:pb-36">
      {/* IZQUIERDA: galería + color picker */}
      <div className="md:col-span-7">
        {colorPrefix ? (
          <div className="grid gap-6 md:grid-cols-12 md:gap-5">
            <div className="md:col-span-8">
              <ProductGallery
                hero={dynamicHero}
                gallery={product.gallery}
                video={product.video}
                alt={product.name}
                fallbackCode={product.code}
                fallbackName={product.shortName}
              />
            </div>
            <div className="md:col-span-4">
              <div className="md:sticky md:top-32 rounded-3xl border border-cobalt/10 bg-white/60 p-3 backdrop-blur-sm md:p-4">
                <div className="mb-3 flex items-baseline justify-between gap-2">
                  <h2
                    className="text-base text-cobalt md:text-lg"
                    style={{ fontFamily: "var(--font-bagel)" }}
                  >
                    Escogé tu color
                  </h2>
                  <span className="text-[9px] uppercase tracking-[0.18em] text-cobalt/55">
                    ZMK · 88
                  </span>
                </div>
                <ColorPicker
                  selectedId={selectedColor?.id ?? null}
                  onSelect={setSelectedColor}
                />
              </div>
            </div>
          </div>
        ) : (
          <ProductGallery
            hero={dynamicHero}
            gallery={product.gallery}
            video={product.video}
            alt={product.name}
            fallbackCode={product.code}
            fallbackName={product.shortName}
          />
        )}
      </div>

      {/* DERECHA: info + precio + CTA */}
      <div className="md:col-span-5 md:sticky md:top-32 md:self-start">
        <h1
          className="text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] text-cobalt"
          style={{ fontFamily: "var(--font-bagel)" }}
        >
          {product.name}
        </h1>

        <div className="mt-6 flex items-baseline gap-3">
          <span
            className="text-5xl text-cobalt"
            style={{ fontFamily: "var(--font-bagel)" }}
          >
            {product.priceLabel}
          </span>
          {product.priceEstimated && (
            <span className="text-xs font-medium uppercase tracking-wider text-black/60">
              desde · final según diseño
            </span>
          )}
        </div>

        {selectedColor && (
          <p className="mt-3 flex items-center gap-2 text-sm text-cobalt/70">
            <span
              className="h-4 w-4 rounded-full border border-cobalt/15"
              style={{ backgroundColor: selectedColor.hex }}
              aria-hidden
            />
            Color: <strong className="text-cobalt">{selectedColor.name}</strong>
          </p>
        )}

        <p className="mt-8 text-lg leading-relaxed text-black/85">
          {product.description}
        </p>

        <dl className="mt-10 space-y-4 border-t border-black/15 pt-8 text-sm">
          <Row label="Dimensiones totales" value={product.totalSize} />
          <Row label="Dimensiones para el arte" value={product.artSize} />
          <Row label="Materiales" value={product.materials} />
          <Row label="Pintura" value={product.paint} />
          {product.notes && <Row label="Nota" value={product.notes} />}
        </dl>

        {/* Aviso de despacho - importante antes de comprar */}
        <div className="mt-8 rounded-2xl border border-cobalt/15 bg-cobalt/5 px-4 py-3 text-sm text-cobalt">
          <p className="flex items-center gap-2">
            <span aria-hidden>📦</span>
            <span>
              <strong>Trabajamos bajo pedido.</strong> Nos contactaremos los
              próximos días para darte la fecha exacta del despacho de tu
              pedido.
            </span>
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <AddToCartButton product={product} selectedColor={selectedColor} />
          <div className="grid gap-3 sm:grid-cols-2">
            <WhatsAppButton message={message} size="lg">
              Preguntar por WhatsApp
            </WhatsAppButton>
            <a
              href={whatsappLink(
                `Hola MUFFMENT, quiero el ${product.name} pero a la medida. ¿Cómo cotizamos?`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="inline-flex items-center justify-center rounded-full border border-cobalt px-6 py-4 text-base font-medium uppercase tracking-wider text-cobalt transition-colors hover:bg-cobalt hover:text-cream"
            >
              A la medida
            </a>
          </div>
        </div>

        <p className="mt-6 text-xs uppercase tracking-widest text-black/50">
          ✦ Garantía 3 años ✦ Hecho en Colombia ✦
        </p>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 md:grid-cols-[180px_1fr]">
      <dt className="text-xs font-medium uppercase tracking-wider text-black/60">
        {label}
      </dt>
      <dd className="text-cobalt">{value}</dd>
    </div>
  );
}
