"use client";

import { useMemo, useState } from "react";
import { ProductGallery } from "./ProductGallery";
import { ColorPicker } from "./ColorPicker";
import type { Product } from "@/data/products";
import type { Color } from "@/data/colors";

type Props = {
  product: Product;
  /** Slug-prefix usado para encontrar las variantes pre-generadas en
   *  /public/img/products/colors/{prefix}-{color-id}.jpg.
   *  Si se omite, no se muestra el ColorPicker. */
  colorPrefix?: string;
};

/**
 * Layout horizontal: galería (izquierda) + color picker sticky (derecha)
 * cuando el producto soporta seleccion de color. En mobile stackea
 * verticalmente.
 */
export function ProductDetailMedia({ product, colorPrefix }: Props) {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  const dynamicHero = useMemo(() => {
    if (!colorPrefix || !selectedColor) return product.hero;
    return `/img/products/colors/${colorPrefix}-${selectedColor.id}.jpg`;
  }, [colorPrefix, selectedColor, product.hero]);

  // Sin colorPicker: solo galería full width
  if (!colorPrefix) {
    return (
      <ProductGallery
        hero={dynamicHero}
        gallery={product.gallery}
        video={product.video}
        alt={product.name}
        fallbackCode={product.code}
        fallbackName={product.shortName}
      />
    );
  }

  // Con colorPicker: 2 columnas internas. Galería grande izquierda,
  // picker compacto a la derecha (sticky para no perder de vista
  // al cambiar color).
  return (
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
  );
}
