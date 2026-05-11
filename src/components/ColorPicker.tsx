"use client";

import { useState } from "react";
import { COLORS, FAMILY_INFO, FINISH_INFO, type Color } from "@/data/colors";
import { cn } from "@/lib/utils";

type Props = {
  selectedId: string | null;
  onSelect: (color: Color | null) => void;
};

/**
 * Grilla rectangular de "bolitas" de color. Hover muestra la card con info,
 * click selecciona el color (el padre se encarga de cambiar la imagen del
 * producto). Permite des-seleccionar haciendo click en la bolita activa.
 */
export function ColorPicker({ selectedId, onSelect }: Props) {
  const [hover, setHover] = useState<Color | null>(null);
  const tooltip = hover ?? COLORS.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="relative">
      {/* Tooltip card — muestra info del color hovered o seleccionado */}
      {tooltip && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-cobalt/10 bg-cream/40 px-4 py-3">
          <span
            aria-hidden
            className="block h-10 w-10 shrink-0 rounded-full border border-cobalt/15 shadow-sm"
            style={{ backgroundColor: tooltip.hex }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-cobalt">{tooltip.name}</p>
            <p className="text-xs text-cobalt/65">
              {FAMILY_INFO[tooltip.family].label} ·{" "}
              {tooltip.finishes.map((f) => FINISH_INFO[f].label).join(" · ")}
              {tooltip.bicapaMate && " · Bicapa Mate disponible"}
            </p>
          </div>
        </div>
      )}

      {/* Grilla rectangular - 11 columnas como en una carta industrial */}
      <div className="grid grid-cols-11 gap-1.5 sm:gap-2">
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
                "relative aspect-square rounded-full border transition-all",
                active
                  ? "border-cobalt scale-110 ring-2 ring-cobalt/40 ring-offset-2 ring-offset-white shadow-md"
                  : "border-cobalt/15 hover:scale-110 hover:shadow-sm",
              )}
              style={{ backgroundColor: color.hex }}
            />
          );
        })}
      </div>

      {selectedId && (
        <p className="mt-4 text-center text-xs uppercase tracking-wider text-cobalt/60">
          Click de nuevo en el color para volver al original
        </p>
      )}
    </div>
  );
}
