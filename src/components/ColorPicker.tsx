"use client";

import Image from "next/image";
import { useState } from "react";
import { COLORS, FAMILY_INFO, FINISH_INFO, type Color } from "@/data/colors";
import { cn } from "@/lib/utils";

type Props = {
  selectedId: string | null;
  onSelect: (color: Color | null) => void;
};

/**
 * Grilla compacta de bolitas con las texturas reales (las mismas que se
 * usan en /colores — PNGs pre-renderizados con brillo/mate/texturizado/
 * destellos segun el acabado). Hover muestra card con info, click pinta
 * el producto del color.
 */
export function ColorPicker({ selectedId, onSelect }: Props) {
  const [hover, setHover] = useState<Color | null>(null);
  const tooltip = hover ?? COLORS.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="space-y-3">
      {/* Tooltip card — siempre presente para evitar layout shift */}
      <div className="min-h-[64px] rounded-2xl border border-cobalt/10 bg-cream/40 px-3 py-2">
        {tooltip ? (
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="block h-8 w-8 shrink-0 rounded-full border border-cobalt/15 shadow-sm"
              style={{ backgroundColor: tooltip.hex }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-cobalt leading-tight">{tooltip.name}</p>
              <p className="text-[10px] text-cobalt/65 leading-snug mt-0.5">
                {FAMILY_INFO[tooltip.family].label} ·{" "}
                {tooltip.finishes.map((f) => FINISH_INFO[f].label).join(" · ")}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-[11px] uppercase tracking-wider text-cobalt/45">
            Pasa el mouse sobre un color
          </div>
        )}
      </div>

      {/* Grilla compacta — 8 columnas, bolitas chicas */}
      <div className="grid grid-cols-8 gap-1">
        {COLORS.map((color) => {
          const active = color.id === selectedId;
          return (
            <button
              key={color.id}
              type="button"
              data-cursor="hover"
              onMouseEnter={() => setHover(color)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelect(active ? null : color)}
              aria-label={color.name}
              aria-pressed={active}
              className={cn(
                "relative aspect-square overflow-hidden rounded-full transition-all",
                active
                  ? "ring-2 ring-cobalt ring-offset-2 ring-offset-white scale-110 z-10"
                  : "hover:scale-110 hover:z-10",
              )}
              style={{
                boxShadow: active
                  ? "0 4px 16px rgba(0,0,0,0.25)"
                  : "0 1px 4px rgba(0,0,0,0.18)",
              }}
            >
              <Image
                src={`/colors/${color.id}.png`}
                alt={color.name}
                fill
                sizes="40px"
                className="object-cover"
                unoptimized
              />
            </button>
          );
        })}
      </div>

      {selectedId && (
        <p className="text-center text-[10px] uppercase tracking-wider text-cobalt/50">
          Click de nuevo para volver al original
        </p>
      )}
    </div>
  );
}
