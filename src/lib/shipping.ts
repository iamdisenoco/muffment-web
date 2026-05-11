import type { CartItem } from "@/hooks/useCart";

/**
 * Tabla de envíos MUFFMENT. Cobramos UN solo envío del tamaño máximo
 * del carrito (no por item) — los productos viajan juntos como un
 * paquete único.
 */

export type ShippingZone = "medellin" | "nacional";
export type ShippingSize = "pequeno" | "mediano" | "grande";

export const SHIPPING_RATES: Record<ShippingZone, Record<ShippingSize, number>> = {
  medellin: {
    pequeno: 18000,
    mediano: 25000, // Medellín: medianos pagan como grandes
    grande: 25000,
  },
  nacional: {
    pequeno: 20000,
    mediano: 28000,
    grande: 38000,
  },
};

export const ZONE_LABELS: Record<ShippingZone, string> = {
  medellin: "Medellín",
  nacional: "Resto del país",
};

const SIZE_ORDER: Record<ShippingSize, number> = {
  pequeno: 1,
  mediano: 2,
  grande: 3,
};

const SIZE_LABELS: Record<ShippingSize, string> = {
  pequeno: "Pequeño",
  mediano: "Mediano",
  grande: "Grande",
};

/**
 * Item del carrito incluye el shippingSize del producto base.
 * Acá lo extendemos para que el carrito pueda calcular envío.
 */
export type CartItemWithSize = CartItem & { shippingSize: ShippingSize };

/**
 * Calcula el costo de envío para un carrito en una zona dada.
 * Retorna 0 si el carrito está vacío.
 *
 * Lógica: TODOS los items viajan en un paquete del tamaño del item más
 * grande. Se cobra UN solo envío.
 */
export function calculateShipping(
  items: CartItemWithSize[],
  zone: ShippingZone,
): { cost: number; maxSize: ShippingSize | null } {
  if (items.length === 0) return { cost: 0, maxSize: null };

  const maxSize = items.reduce<ShippingSize>((acc, item) => {
    return SIZE_ORDER[item.shippingSize] > SIZE_ORDER[acc] ? item.shippingSize : acc;
  }, "pequeno");

  return { cost: SHIPPING_RATES[zone][maxSize], maxSize };
}

export function getSizeLabel(size: ShippingSize): string {
  return SIZE_LABELS[size];
}
