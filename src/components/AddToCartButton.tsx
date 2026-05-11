"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/data/products";
import type { Color } from "@/data/colors";
import { cn } from "@/lib/utils";

type Props = {
  product: Product;
  selectedColor?: Color | null;
};

/**
 * Botón "Agregar al carrito". Toma el producto y opcionalmente el color
 * seleccionado (si el producto soporta picker). Muestra micro-feedback
 * de éxito al agregar y abre el CartDrawer.
 */
export function AddToCartButton({ product, selectedColor }: Props) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);

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
        ? { id: selectedColor.id, name: selectedColor.name, hex: selectedColor.hex }
        : undefined,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      data-cursor="hover"
      className={cn(
        "w-full rounded-full px-6 py-4 text-base font-semibold uppercase tracking-wider transition-all md:text-lg",
        justAdded
          ? "bg-[#06d6a0] text-cobalt"
          : "bg-cobalt text-cream hover:scale-[1.02] hover:bg-cobalt/90 active:scale-[0.98]",
      )}
    >
      {justAdded ? "✓ Agregado al carrito" : "Agregar al carrito"}
    </button>
  );
}
