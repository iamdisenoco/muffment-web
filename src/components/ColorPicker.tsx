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
    <div className="space-y-2.5">
      {/* Mini tooltip - 1 linea inline arriba, sin caja */}
      <div className="flex h-5 items-center text-[11px] text-cobalt/75">
        {tooltip ? (
          <>
            <span
              aria-hidden
              className="mr-2 inline-block h-3 w-3 shrink-0 rounded-full border border-cobalt/15"
              style={{ backgroundColor: tooltip.hex }}
            />
            <span className="font-medium text-cobalt">{tooltip.name}</span>
            <span className="ml-1.5 text-cobalt/55">
              · {tooltip.finishes.map((f) => FINISH_INFO[f].label).join(", ")}
            </span>
          </>
        ) : (
          <span className="text-[10px] uppercase tracking-[0.25em] text-cobalt/40">
            Hover sobre un color
          </span>
        )}
      </div>

      {/* Grilla MUY compacta — 11 columnas, bolitas mini */}
      <div className="grid grid-cols-11 gap-[3px]">
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
                  ? "ring-2 ring-cobalt ring-offset-1 ring-offset-white scale-125 z-10"
                  : "hover:scale-125 hover:z-10",
              )}
              style={{
                boxShadow: active
                  ? "0 3px 10px rgba(0,0,0,0.2)"
                  : "0 1px 2px rgba(0,0,0,0.12)",
              }}
            >
              <Image
                src={`/colors/${color.id}.png`}
                alt={color.name}
                fill
                sizes="28px"
                className="object-cover"
                unoptimized
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
