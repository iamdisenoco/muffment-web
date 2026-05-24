"use client";

/**
 * ColorMandalaMini — versión compacta del CollageWall de /colores.
 * Copia exacta de la lógica (PortalTooltip + ColorBubble + CollageWall) pero
 * con un container más chico (default max-w 320px).
 *
 * Funciona idéntico al mandala grande:
 *  - hover swatch → bolita crece (scale 1.32 + lift)
 *  - PortalTooltip con info del color + finishes + bicapaMate
 *  - cleanup timeout 150ms anti-stuck
 *  - bubble-breathe animation
 *
 * Si en el futuro se unifica con /colores/page.tsx, refactor ambos para
 * importar desde acá. Por ahora, copia.
 */

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { FinishIcon } from "@/components/FinishIcon";
import { cn } from "@/lib/utils";
import {
  COLORS,
  FINISH_INFO,
  type Color,
} from "@/data/colors";

/* ── PortalTooltip — idéntico a /colores ── */
function PortalTooltip({ color, anchor }: { color: Color; anchor: { x: number; y: number } }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className="pointer-events-none fixed z-[9999] w-max max-w-[260px] -translate-x-1/2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl"
      style={{ left: anchor.x, top: anchor.y + 14 }}
    >
      <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-white/20 bg-white/10 backdrop-blur-xl" />
      <div className="relative">
        <p className="text-base leading-tight text-white" style={{ fontFamily: "var(--font-bagel)" }}>
          {color.name}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
          {color.finishes.map((f, i) => (
            <motion.span
              key={f}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 + i * 0.04, duration: 0.18 }}
              className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-white/90"
            >
              <FinishIcon finish={f} size={12} />
              {FINISH_INFO[f].label}
            </motion.span>
          ))}
        </div>
        {color.bicapaMate && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.04 + color.finishes.length * 0.04 }}
            className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-white/60"
          >
            ✦ También en Bicapa Mate
          </motion.p>
        )}
      </div>
    </motion.div>,
    document.body,
  );
}

/* ── ColorBubble — idéntico a /colores ── */
function ColorBubble({
  color,
  isActive,
  onActivate,
  onDeactivate,
}: {
  color: Color;
  isActive: boolean;
  onActivate: (id: string, anchor: { x: number; y: number }) => void;
  onDeactivate: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const hover = isActive;

  const activate = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      onActivate(color.id, { x: rect.left + rect.width / 2, y: rect.bottom });
    }
  };

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    activate();
  };

  return (
    <div
      ref={ref}
      onMouseEnter={activate}
      onMouseLeave={() => onDeactivate(color.id)}
      onClick={onClick}
      className={cn("relative h-full w-full", hover ? "z-50" : "z-0")}
    >
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.4 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 -z-10 rounded-full blur-2xl"
            style={{ backgroundColor: color.hex }}
          />
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={color.name}
        data-cursor="hover"
        animate={{
          scale: hover ? 1.32 : 1,
          y: hover ? -8 : 0,
        }}
        transition={{ type: "spring", stiffness: 320, damping: 16 }}
        className="relative block h-full w-full rounded-full"
        style={{
          boxShadow: hover
            ? `0 0 0 3px rgba(255,255,255,0.95), 0 22px 50px rgba(0,0,0,0.55)`
            : `0 4px 12px rgba(0,0,0,0.45)`,
          transition: "box-shadow 200ms ease-out",
        }}
      >
        <Image
          src={`/colors/${color.id}.png`}
          alt={color.name}
          width={800}
          height={800}
          className="h-full w-full"
          unoptimized
        />
      </motion.button>
    </div>
  );
}

/* ── Family weight + geometry helpers (idéntico) ── */
const FAMILY_WEIGHT: Record<string, number> = {
  blancos: 0, beiges: 1, tierras: 2, dorados: 3, amarillos: 4,
  rojos: 5, rosados: 6, azules: 7, verdes: 8, grises: 9, negros: 10,
};

function hash(id: string): number {
  return Array.from(id).reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
}

const RINGS = [
  { count: 1, radius: 0 },
  { count: 6, radius: 8.8 },
  { count: 12, radius: 17.5 },
  { count: 18, radius: 26 },
  { count: 24, radius: 34.5 },
  { count: 27, radius: 42.5 },
];

const BUBBLE_PCT = 9;

/* ── Component principal exportable ── */
export function ColorMandalaMini({
  colors = COLORS,
  maxSize = 320,
}: {
  colors?: Color[];
  /** Max width/height en px del mandala (es siempre cuadrado). Default 320 */
  maxSize?: number;
}) {
  const ordered = useMemo(() => {
    const arr = [...colors];
    arr.sort((a, b) => {
      const fa = FAMILY_WEIGHT[a.family] ?? 99;
      const fb = FAMILY_WEIGHT[b.family] ?? 99;
      if (fa !== fb) return fa - fb;
      return hash(a.id) - hash(b.id);
    });
    return arr;
  }, [colors]);

  const positions = useMemo(() => {
    const out: { xPct: number; yPct: number; ring: number }[] = [];
    for (let r = 0; r < RINGS.length; r++) {
      const { count, radius } = RINGS[r];
      const startAngle = -Math.PI / 2 + (r * Math.PI) / 12;
      for (let j = 0; j < count; j++) {
        const angle = startAngle + (j / count) * Math.PI * 2;
        out.push({
          xPct: Math.cos(angle) * radius,
          yPct: Math.sin(angle) * radius,
          ring: r,
        });
      }
    }
    return out;
  }, []);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeAnchor, setActiveAnchor] = useState({ x: 0, y: 0 });
  const cleanupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleActivate = useCallback(
    (id: string, anchor: { x: number; y: number }) => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
        cleanupTimeoutRef.current = null;
      }
      setActiveId(id);
      setActiveAnchor(anchor);
    },
    [],
  );

  const handleDeactivate = useCallback((id: string) => {
    if (cleanupTimeoutRef.current) clearTimeout(cleanupTimeoutRef.current);
    cleanupTimeoutRef.current = setTimeout(() => {
      setActiveId((current) => (current === id ? null : current));
      cleanupTimeoutRef.current = null;
    }, 80); // Antes 150ms → 80ms para cleanup más agresivo del bug stuck
  }, []);

  /* Safety net global: si el mouse NO está sobre ningún elemento .color-bubble
     en cada mousemove → cleanup inmediato. Resuelve el caso donde mouseleave
     no se dispara al pasar rápido entre bolitas overlapping. */
  useEffect(() => {
    const handleGlobalMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && !(e as any).toElement) {
        if (cleanupTimeoutRef.current) clearTimeout(cleanupTimeoutRef.current);
        setActiveId(null);
      }
    };
    const handleGlobalMouseMove = (e: MouseEvent) => {
      // Si el mouse está sobre el área del mandala, no hacer nada (los handlers
      // de las bolas se ocupan). Si el mouse está afuera del mandala, cleanup.
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInsideMandala = target.closest("[data-mandala-mini='true']");
      if (!isInsideMandala) {
        if (cleanupTimeoutRef.current) clearTimeout(cleanupTimeoutRef.current);
        setActiveId(null);
      }
    };
    document.addEventListener("mouseleave", handleGlobalMouseOut);
    document.addEventListener("mousemove", handleGlobalMouseMove, { passive: true });
    return () => {
      document.removeEventListener("mouseleave", handleGlobalMouseOut);
      document.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, []);

  const activeColor = activeId ? ordered.find((c) => c.id === activeId) ?? null : null;

  return (
    <div
      data-mandala-mini="true"
      className="relative aspect-square w-full"
      style={{ maxWidth: `${maxSize}px` }}
      onMouseLeave={() => setActiveId(null)}
      onClick={() => setActiveId(null)}
    >
      {ordered.map((c, i) => {
        const pos = positions[i];
        if (!pos) return null;
        const period = 5 + (hash(c.id) % 1500) / 500;
        const delay = -((hash(c.id) >> 5) % 7000) / 1000;
        return (
          <div
            key={c.id}
            className="absolute"
            style={{
              /* FIX hydration: pre-calcular en JS en lugar de calc() inline.
                 SSR estaba simplificando calc(50% + X% - 4.5%) → calc(N.NNN%)
                 truncado a 3 decimales, mientras cliente emitía la fórmula
                 completa → mismatch en hydration. */
              left: `${(50 + pos.xPct - BUBBLE_PCT / 2).toFixed(4)}%`,
              top: `${(50 + pos.yPct - BUBBLE_PCT / 2).toFixed(4)}%`,
              width: `${BUBBLE_PCT}%`,
              height: `${BUBBLE_PCT}%`,
              animation: `bubble-breathe ${period}s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }}
          >
            <ColorBubble
              color={c}
              isActive={activeId === c.id}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
            />
          </div>
        );
      })}
      <AnimatePresence>
        {activeColor && (
          <PortalTooltip key={activeColor.id} color={activeColor} anchor={activeAnchor} />
        )}
      </AnimatePresence>
    </div>
  );
}
