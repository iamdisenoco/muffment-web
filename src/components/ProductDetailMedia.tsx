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

export function ProductDetailMedia({ product, colorPrefix }: Props) {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  // Si hay color seleccionado, reemplazar el hero por la variante de color.
  // Las imágenes de la galería se mantienen como están (vistas adicionales).
  const dynamicHero = useMemo(() => {
    if (!colorPrefix || !selectedColor) return product.hero;
    return `/img/products/colors/${colorPrefix}-${selectedColor.id}.jpg`;
  }, [colorPrefix, selectedColor, product.hero]);

  return (
    <div className="space-y-6">
      <ProductGallery
        hero={dynamicHero}
        gallery={product.gallery}
        video={product.video}
        alt={product.name}
        fallbackCode={product.code}
        fallbackName={product.shortName}
      />

      {colorPrefix && (
        <div className="rounded-3xl border border-cobalt/10 bg-white/60 p-5 backdrop-blur-sm md:p-6">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2
              className="text-xl text-cobalt md:text-2xl"
              style={{ fontFamily: "var(--font-bagel)" }}
            >
              Escogé tu color
            </h2>
            <span className="text-[10px] uppercase tracking-[0.2em] text-cobalt/55">
              Carta ZMK · 88 colores
            </span>
          </div>
          <ColorPicker
            selectedId={selectedColor?.id ?? null}
            onSelect={setSelectedColor}
          />
        </div>
      )}
    </div>
  );
}
