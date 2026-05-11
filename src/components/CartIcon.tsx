"use client";

import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

type Props = {
  onDark?: boolean;
};

/**
 * Icono del carrito para el Header. Muestra badge animado con la cantidad
 * de items. Click abre el CartDrawer.
 */
export function CartIcon({ onDark = false }: Props) {
  const { count, toggle } = useCart();

  return (
    <button
      type="button"
      onClick={toggle}
      data-cursor="hover"
      aria-label={`Carrito (${count} items)`}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-all hover:scale-105",
        onDark
          ? "border-white/45 bg-white/15 text-white hover:border-white/70 hover:bg-white/25"
          : "border-cobalt/40 bg-cobalt/15 text-cobalt hover:border-cobalt/60 hover:bg-cobalt/25",
      )}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && (
        <span
          className={cn(
            "absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums",
            onDark ? "bg-cream text-cobalt" : "bg-cobalt text-cream",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
