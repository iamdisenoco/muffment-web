"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCart, getItemKey, type CartItem } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/**
 * Slide-over lateral derecho con resumen del carrito. Se abre cuando
 * agregás un item o hacés click en el ícono del header.
 */
export function CartDrawer() {
  const { items, subtotal, isOpen, close, updateQuantity, remove } = useCart();

  // Bloquear scroll del body cuando abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-[90] bg-cobalt/40 backdrop-blur-sm"
            aria-hidden
          />

          {/* Drawer */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed inset-y-0 right-0 z-[100] flex w-full max-w-md flex-col bg-cream shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cobalt/10 px-6 py-5">
              <h2
                className="text-2xl text-cobalt"
                style={{ fontFamily: "var(--font-bagel)" }}
              >
                Tu carrito
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar"
                data-cursor="hover"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-cobalt/10 text-cobalt transition-colors hover:bg-cobalt/20"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
                  <div className="text-6xl opacity-30">🛒</div>
                  <p className="text-base text-cobalt/65">
                    Tu carrito está vacío
                  </p>
                  <Link
                    href="/avisos"
                    onClick={close}
                    data-cursor="hover"
                    className="rounded-full bg-cobalt px-6 py-3 text-sm font-medium uppercase tracking-wider text-cream transition-colors hover:bg-cobalt/90"
                  >
                    Ver catálogo
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <CartLineItem
                      key={getItemKey(item)}
                      item={item}
                      onRemove={() => remove(getItemKey(item))}
                      onQuantityChange={(qty) =>
                        updateQuantity(getItemKey(item), qty)
                      }
                    />
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-cobalt/10 bg-cream-light/40 px-6 py-5">
                <div className="mb-1 flex items-baseline justify-between text-cobalt">
                  <span className="text-sm uppercase tracking-wider opacity-70">
                    Subtotal
                  </span>
                  <span
                    className="text-2xl"
                    style={{ fontFamily: "var(--font-bagel)" }}
                  >
                    {COP.format(subtotal)}
                  </span>
                </div>
                <div className="mb-4 rounded-xl bg-cobalt/5 px-3 py-2 text-xs text-cobalt/80">
                  <p>
                    📦 Bajo pedido — te contactaremos los próximos días con la
                    fecha exacta del despacho
                  </p>
                </div>
                <Link
                  href="/carrito"
                  onClick={close}
                  data-cursor="hover"
                  className="block w-full rounded-full bg-cobalt px-6 py-4 text-center text-base font-semibold uppercase tracking-wider text-cream transition-all hover:scale-[1.02] hover:bg-cobalt/90"
                >
                  Ir a pagar
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Sub-component: cada línea del carrito ────────────────────────────
function CartLineItem({
  item,
  onRemove,
  onQuantityChange,
}: {
  item: CartItem;
  onRemove: () => void;
  onQuantityChange: (qty: number) => void;
}) {
  const lineTotal = item.price * item.quantity;
  // Si tiene color, usar la variante de color como imagen
  const colorPrefix = item.hero
    .match(/\/2026\/([\w-]+)-1\.jpg/)?.[1];
  const heroUrl =
    item.color && colorPrefix
      ? `/img/products/colors/${colorPrefix}-${item.color.id}.jpg`
      : item.hero;

  return (
    <li className="flex gap-4 rounded-2xl border border-cobalt/10 bg-white p-3">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream/60">
        <Image
          src={heroUrl}
          alt={item.name}
          fill
          sizes="80px"
          className="object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-cobalt">
            {item.shortName}
          </p>
          {item.color && (
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-cobalt/65">
              <span
                className="h-3 w-3 shrink-0 rounded-full border border-cobalt/15"
                style={{ backgroundColor: item.color.hex }}
                aria-hidden
              />
              {item.color.name}
            </p>
          )}
          <p className="mt-1 text-xs text-cobalt/55">N°{item.code}</p>
        </div>
        <div className="flex items-center justify-between">
          {/* Quantity stepper */}
          <div className="flex items-center gap-1.5 rounded-full bg-cobalt/5 px-1 py-0.5">
            <button
              type="button"
              onClick={() => onQuantityChange(item.quantity - 1)}
              aria-label="Disminuir"
              data-cursor="hover"
              className="flex h-6 w-6 items-center justify-center rounded-full text-cobalt transition-colors hover:bg-cobalt/15"
            >
              −
            </button>
            <span className="min-w-[20px] text-center text-sm font-medium tabular-nums text-cobalt">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(item.quantity + 1)}
              aria-label="Aumentar"
              data-cursor="hover"
              className="flex h-6 w-6 items-center justify-center rounded-full text-cobalt transition-colors hover:bg-cobalt/15"
            >
              +
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-cobalt tabular-nums">
              {COP.format(lineTotal)}
            </span>
            <button
              type="button"
              onClick={onRemove}
              aria-label="Eliminar"
              data-cursor="hover"
              className="flex h-6 w-6 items-center justify-center rounded-full text-cobalt/45 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
