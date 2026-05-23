"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COLORS, FINISH_INFO, type Color } from "@/data/colors";
import { FinishIcon } from "./FinishIcon";
import { cn } from "@/lib/utils";

type Props = {
  selectedId: string | null;
  onSelect: (color: Color | null) => void;
};

/**
 * Grilla compacta de bolitas con las texturas reales (las mismas que se
 * usan en /colores — PNGs pre-renderizados con brillo/mate/texturizado/
 * destellos segun el acabado).
 *
 * Tooltip premium con los MISMOS símbolos SVG (FinishIcon) que la página
 * /colores → consistencia visual de la simbología ZMK.
 *
 *   ┌─────────────────────────────┐
 *   │ ◌ Nombre · ⓘ                │  ← name + Interior/Exterior chip
 *   │ ○ Brillante  ▪ Mate  ✦ Dest │  ← símbolos SVG de cada acabado
 *   │ ✦ También en Bicapa Mate    │  ← si aplica
 *   └─────────────────────────────┘
 */
export function ColorPicker({ selectedId, onSelect }: Props) {
  const [hover, setHover] = useState<Color | null>(null);
  // Tooltip prioriza SELECTED (el que el usuario clickeó) sobre HOVER.
  // Antes era al revés y causaba que el tooltip mostrara un color y el
  // chip de arriba ("Color · X") otro distinto cuando el mouse pasaba
  // sobre otra bolita (Jon 2026-05-23: "todavía no coinciden").
  //
  // Si NO hay seleccionado, sí mostramos el hover como preview.
  const selectedColor = COLORS.find((c) => c.id === selectedId) ?? null;
  const tooltip = selectedColor ?? hover ?? null;

  const isInterior = tooltip?.finishes.includes("interior");
  // Acabados que se muestran como ÍCONOS (excluye "interior" porque ya va
  // en el chip Interior/Exterior).
  const visibleFinishes =
    tooltip?.finishes.filter((f) => f !== "interior") ?? [];

  return (
    <div className="space-y-2.5">
      {/* Tooltip premium — name + chip + íconos de acabados */}
      <div className="min-h-[3.25rem] rounded-lg border border-cobalt/10 bg-white/40 p-2 backdrop-blur-sm">
        <AnimatePresence mode="wait">
          {tooltip ? (
            <motion.div
              key={tooltip.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="space-y-1.5"
            >
              {/* Linea 1: bolita + nombre + chip Interior/Exterior */}
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block h-3 w-3 shrink-0 rounded-full border border-cobalt/15"
                  style={{ backgroundColor: tooltip.hex }}
                />
                <span
                  className="flex-1 text-[12px] font-medium leading-tight text-cobalt"
                  style={{ fontFamily: "var(--font-bagel)" }}
                >
                  {tooltip.name}
                </span>
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
              </div>

              {/* Linea 2: símbolos de acabados (icons + label) */}
              {visibleFinishes.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-cobalt/85">
                  {visibleFinishes.map((f) => (
                    <span
                      key={f}
                      className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-wide"
                      style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
                    >
                      <FinishIcon finish={f} size={11} />
                      {FINISH_INFO[f].label}
                    </span>
                  ))}
                  {tooltip.bicapaMate && (
                    <span
                      className="ml-auto text-[9px] font-semibold uppercase tracking-widest text-cobalt/60"
                      style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
                    >
                      ✦ Bicapa
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <p
              className="flex h-full items-center text-[10px] uppercase tracking-[0.25em] text-cobalt/40"
              style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
            >
              Pasa el mouse sobre un color
            </p>
          )}
        </AnimatePresence>
      </div>

      {/* Grilla MUY compacta — bolitas mini (12 cols, ~7 filas para 88 colors).
          onMouseLeave en el container resetea hover si el cursor sale del grid
          sin pasar por un onMouseLeave individual (bug "stuck description"). */}
      <div
        className="grid grid-cols-12 gap-[2px]"
        onMouseLeave={() => setHover(null)}
      >
        {COLORS.map((color) => {
          const active = color.id === selectedId;
          return (
            <button
              key={color.id}
              type="button"
              data-cursor="hover"
              onMouseEnter={() => setHover(color)}
              // onMouseLeave individual NO se necesita — el container handle.
              // Si lo dejara, el onMouseEnter del siguiente y onMouseLeave
              // del anterior pueden race condition stuck el state.
              onClick={() => {
                // Al click forzamos el tooltip al color seleccionado
                // (en caso de race condition con hover state).
                setHover(active ? null : color);
                onSelect(active ? null : color);
              }}
              aria-label={color.name}
              aria-pressed={active}
              className={cn(
                "relative aspect-square overflow-hidden rounded-full transition-all",
                active
                  ? "z-10 scale-125 ring-2 ring-cobalt ring-offset-1 ring-offset-white"
                  : "hover:z-10 hover:scale-125",
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
