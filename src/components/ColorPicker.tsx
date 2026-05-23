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

  // El finish "interior" indica que el color SOLO es para uso interior.
  // Si no está en la lista, es apto para exterior.
  const isInterior = tooltip?.finishes.includes("interior");
  const visibleFinishes =
    tooltip?.finishes.filter((f) => f !== "interior") ?? [];

  return (
    <div className="space-y-2.5">
      {/* Mini tooltip - linea inline con uso + acabado */}
      <div className="flex h-5 items-center gap-1.5 text-[11px] text-cobalt/75">
        {tooltip ? (
          <>
            <span
              aria-hidden
              className="inline-block h-3 w-3 shrink-0 rounded-full border border-cobalt/15"
              style={{ backgroundColor: tooltip.hex }}
            />
            <span className="font-medium text-cobalt">{tooltip.name}</span>
            <span
              className={cn(
                "shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.15em]",
                isInterior
                  ? "bg-[#f9c80e]/30 text-cobalt"
                  : "bg-[#06d6a0]/30 text-cobalt",
              )}
            >
              {isInterior ? "Interior" : "Exterior"}
            </span>
            {visibleFinishes.length > 0 && (
              <span className="truncate text-cobalt/55">
                · {visibleFinishes.map((f) => FINISH_INFO[f].label).join(", ")}
              </span>
            )}
          </>
        ) : (
          <span className="text-[10px] uppercase tracking-[0.25em] text-cobalt/40">
            Hover sobre un color
          </span>
        )}
      </div>

      {/* Grilla MUY compacta — bolitas mini (12 cols, ~7 filas para 88 colors) */}
      <div className="grid grid-cols-12 gap-[2px]">
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
