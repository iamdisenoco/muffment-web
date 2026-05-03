"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/data/products";

type Filter = "all" | "piso" | "pared" | "mesa" | "accesorio";

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "piso", label: "Aviso de piso" },
  { id: "pared", label: "Aviso de pared" },
  { id: "mesa", label: "Aviso de mesa" },
  { id: "accesorio", label: "Accesorios" },
];

export function ProductCatalog({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  return (
    <div className="relative">
      {/* FILTRO FLOTANTE — pill futurista glassmorphism, sticky bajo el header.
          La pill activa se anima entre opciones con LayoutGroup. */}
      <div className="sticky top-24 z-30 mb-8 flex justify-center md:mb-12">
        <LayoutGroup>
          <nav
            role="tablist"
            aria-label="Filtrar avisos por categoría"
            className="flex items-center gap-1 rounded-full border border-cream/20 bg-cream/10 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl"
            style={{
              // Borde sutil con gradiente para reforzar el look futurista
              backgroundImage:
                "linear-gradient(180deg, rgba(232,226,209,0.12), rgba(232,226,209,0.04))",
            }}
          >
            {FILTERS.map((f) => {
              const active = f.id === filter;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  data-cursor="hover"
                  onClick={() => setFilter(f.id)}
                  className="relative rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors md:px-4 md:py-2 md:text-xs"
                >
                  {/* Pill del estado activo (animada con layoutId) */}
                  {active && (
                    <motion.span
                      layoutId="filter-active-pill"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-cream shadow-[0_4px_16px_rgba(232,226,209,0.4)]"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span
                    className={
                      "relative " + (active ? "text-cobalt" : "text-cream/75 hover:text-cream")
                    }
                  >
                    {f.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </LayoutGroup>
      </div>

      {/* Grid muy denso estilo phantom — gap 1px, cards cuadradas */}
      <div className="grid grid-cols-2 gap-px sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25, delay: i * 0.015 }}
            >
              <ProductCard product={p} index={0} size="sm" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
