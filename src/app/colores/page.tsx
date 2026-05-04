"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { cn } from "@/lib/utils";
import {
  COLORS,
  FINISH_INFO,
  type Color,
  type Finish,
} from "@/data/colors";

// ─────────────────────────────────────────────────────────────────────────────
// Iconos para los acabados — coinciden con la simbología de la carta ZMK.
// ─────────────────────────────────────────────────────────────────────────────
function FinishIcon({ finish, size = 14 }: { finish: Finish; size?: number }) {
  const stroke = "currentColor";
  const fill = "currentColor";
  switch (finish) {
    case "interior":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="7" fill={fill} />
          <text x="8" y="11.5" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" fontFamily="Satoshi, sans-serif">i</text>
        </svg>
      );
    case "brillante":
      return <svg width={size} height={size} viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.5" fill="none" stroke={stroke} strokeWidth="1.4" /></svg>;
    case "semi-brillante":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="6.5" fill="none" stroke={stroke} strokeWidth="1.4" />
          <path d="M 8 1.5 A 6.5 6.5 0 0 0 8 14.5 Z" fill={fill} />
        </svg>
      );
    case "mate":
      return <svg width={size} height={size} viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" fill={fill} /></svg>;
    case "semi-mate":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <rect x="2" y="2" width="12" height="12" fill="none" stroke={stroke} strokeWidth="1.4" />
          <rect x="2" y="2" width="6" height="12" fill={fill} />
        </svg>
      );
    case "texturizado":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <rect x="2" y="2" width="12" height="12" fill="none" stroke={stroke} strokeWidth="1.4" />
          <line x1="2" y1="2" x2="14" y2="14" stroke={stroke} strokeWidth="1.2" />
          <line x1="14" y1="2" x2="2" y2="14" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case "microtexturizado":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <rect x="2" y="2" width="12" height="12" fill="none" stroke={stroke} strokeWidth="1.4" />
          <circle cx="5" cy="5" r="0.9" fill={fill} />
          <circle cx="11" cy="5" r="0.9" fill={fill} />
          <circle cx="8" cy="8" r="0.9" fill={fill} />
          <circle cx="5" cy="11" r="0.9" fill={fill} />
          <circle cx="11" cy="11" r="0.9" fill={fill} />
        </svg>
      );
    case "destellos":
      return <svg width={size} height={size} viewBox="0 0 16 16"><path d="M 8 1 L 9.2 6.8 L 15 8 L 9.2 9.2 L 8 15 L 6.8 9.2 L 1 8 L 6.8 6.8 Z" fill={fill}/></svg>;
    case "micro-destellos":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16">
          <path d="M 6 3 L 6.7 5.3 L 9 6 L 6.7 6.7 L 6 9 L 5.3 6.7 L 3 6 L 5.3 5.3 Z" fill={fill}/>
          <circle cx="11" cy="11" r="1.2" fill={fill} />
        </svg>
      );
    default: return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Tooltip flotante renderizado vía portal a document.body para ESCAPAR los
// stacking contexts creados por los `transform` de cada bola del collage.
// Recibe (x, y) absolutos en el viewport (calculados con getBoundingClientRect).
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Una bola del collage.
// - Outer wrapper: aplica margins negativos y transform de offset/rotación.
//   Al hacer hover, se promueve a z-50 (sin animación, instantáneo) para que
//   el tooltip aparezca encima de las bolas vecinas.
// - motion.button (interno): salta con spring, contra-rota la rotación del
//   padre, glow pulsante, sombra crecida. Las animaciones viven aquí.
// - PortalTooltip: renderizado a body via portal para escapar todos los
//   stacking contexts del collage.
// ─────────────────────────────────────────────────────────────────────────────
function ColorBubble({
  color,
  size,
  offset,
}: {
  color: Color;
  size: number;
  offset: { x: number; y: number; rotate: number };
}) {
  const [hover, setHover] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const dark = isDark(color.hex);

  const handleEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setAnchor({ x: rect.left + rect.width / 2, y: rect.bottom });
    }
    setHover(true);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setHover(false)}
      className={cn("relative", hover ? "z-50" : "z-0")}
      style={{
        marginLeft: -Math.round(size * 0.14),
        marginRight: -Math.round(size * 0.14),
        marginTop: -Math.round(size * 0.10),
        marginBottom: -Math.round(size * 0.10),
        transform: `translate(${offset.x}px, ${offset.y}px) rotate(${offset.rotate}deg)`,
      }}
    >
      {/* Glow pulsante detrás del swatch */}
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
          y: hover ? -14 : 0,
          rotate: hover ? -offset.rotate : 0,
        }}
        transition={{ type: "spring", stiffness: 320, damping: 16 }}
        className="relative block rounded-full"
        style={{
          width: size,
          height: size,
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

      <AnimatePresence>
        {hover && <PortalTooltip color={color} anchor={anchor} />}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Collage: todos los colores juntos, sin separar por familia, con tamaños
// variados (deterministas según el id) — algunos grandes/medianos/chicos.
// Usamos flex-wrap para que se acomoden naturalmente. Sembramos los colores
// para que tonos similares queden cerca pero no agrupados rígidamente.
// ─────────────────────────────────────────────────────────────────────────────
const FAMILY_WEIGHT: Record<string, number> = {
  blancos: 0, beiges: 1, tierras: 2, dorados: 3, amarillos: 4,
  rojos: 5, rosados: 6, azules: 7, verdes: 8, grises: 9, negros: 10,
};

// Hash determinista a partir del id (para tamaño + offset + rotación
// estables entre renders).
function hash(id: string): number {
  return Array.from(id).reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
}

function pickSize(id: string): number {
  // Variación más sutil entre tamaños (rango 76→124, 63% en vez de 121%).
  const r = hash(id) % 100;
  if (r < 22) return 124; // grande
  if (r < 60) return 104; // medio
  return 84;              // chico
}

function pickOffset(id: string): { x: number; y: number; rotate: number } {
  const h = hash(id);
  return {
    x: ((h % 21) - 10),                  // -10..10 px (menos)
    y: (((h >> 5) % 19) - 9),            // -9..9 px (menos)
    rotate: (((h >> 10) % 17) - 8),      // -8..8 deg (menos)
  };
}

// Anillos concéntricos de un mandala. Suma EXACTA = 88 (total de chips).
// Cada anillo tiene N bolas distribuidas uniformemente en 360°. El radio se
// calcula para que los anillos se superpongan ~25% (similar al overlap del
// collage previo) en TODAS las direcciones.
const RINGS = [
  { count: 1, radius: 0 },
  { count: 6, radius: 72 },
  { count: 12, radius: 142 },
  { count: 18, radius: 210 },
  { count: 24, radius: 276 },
  { count: 27, radius: 342 },
];

function CollageWall({ colors }: { colors: Color[] }) {
  // Ordenamos por familia → el mandala tiene un flujo tonal radial.
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

  // Computa posición (x, y) absoluta para cada bola en el mandala.
  const positions = useMemo(() => {
    const out: { x: number; y: number; ring: number }[] = [];
    for (let r = 0; r < RINGS.length; r++) {
      const { count, radius } = RINGS[r];
      // Empieza desde -90° (top) y rota — el offset por anillo lo decala
      // levemente para que las bolas no estén alineadas radialmente.
      const startAngle = -Math.PI / 2 + (r * Math.PI) / 12;
      for (let j = 0; j < count; j++) {
        const angle = startAngle + (j / count) * Math.PI * 2;
        out.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, ring: r });
      }
    }
    return out;
  }, []);

  // Tamaño uniforme.
  const SIZE = 72;
  const halfBox = 400; // contenedor 800x800 a escala 1x

  // El mandala se construye en geometría fija 800×800. Si el viewport es
  // mas chico, el wrapper aplica scale via CSS para que quepa. Mantiene
  // proporciones perfectas de los anillos a cualquier ancho.
  return (
    <div className="mandala-outer mx-auto aspect-square w-full max-w-[800px]">
      <div className="mandala-inner">
      {ordered.map((c, i) => {
        const pos = positions[i];
        if (!pos) return null;
        // Cada bola respira con CSS keyframe + animation-delay negativo:
        // CSS sí soporta delay negativo correctamente → cada bola arranca
        // en un punto distinto del ciclo. Period extra-largo (random por
        // bola) evita sincronización visible.
        const period = 5 + (hash(c.id) % 1500) / 500; // 5-8s por bola
        const delay = -((hash(c.id) >> 5) % 7000) / 1000; // -0..-7s
        return (
          <div
            key={c.id}
            className="absolute"
            style={{
              left: halfBox + pos.x - SIZE / 2,
              top: halfBox + pos.y - SIZE / 2,
              animation: `bubble-breathe ${period}s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }}
          >
            <ColorBubble
              color={c}
              size={SIZE}
              offset={{ x: 0, y: 0, rotate: 0 }}
            />
          </div>
        );
      })}
      </div>
      <style>{`
        .mandala-inner {
          position: relative;
          width: 800px;
          height: 800px;
          transform-origin: top left;
        }
        @media (max-width: 832px) {
          /* el viewport limit incluye 16px padding a cada lado del container */
          .mandala-inner {
            transform: scale(calc((100vw - 32px) / 800));
          }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Título "Carta de color." con cada letra ciclando un rainbow individual,
// con stagger entre letras → efecto onda.
// ─────────────────────────────────────────────────────────────────────────────
function RainbowTitle({ text }: { text: string }) {
  return (
    <h1
      className="mx-auto max-w-[14ch] text-center text-[clamp(3rem,9vw,9rem)] leading-[0.9] tracking-tight"
      style={{ fontFamily: "var(--font-bagel)" }}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            // Reusa la animación cursor-rainbow definida en globals.css
            // (cicla entre cobalt → naranja → amarillo → verde → rosa → cyan).
            // El delay negativo arranca cada letra en un punto distinto del
            // ciclo → onda continua de color.
            animation: "cursor-rainbow 6s linear infinite",
            animationDelay: `${-i * 0.18}s`,
          }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </h1>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Leyenda compacta de los símbolos.
// ─────────────────────────────────────────────────────────────────────────────
function Legend() {
  const finishes: Finish[] = [
    "interior", "brillante", "semi-brillante", "mate", "semi-mate",
    "texturizado", "microtexturizado", "destellos", "micro-destellos",
  ];
  return (
    <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-md md:p-8">
      <h3 className="text-xl text-white md:text-2xl" style={{ fontFamily: "var(--font-bagel)" }}>
        Cada símbolo cuenta algo.
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">
        Pasa el mouse sobre cada bola para ver su nombre y los acabados que
        trae. Cada color puede combinar varios símbolos.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-2.5 text-white sm:grid-cols-3 lg:grid-cols-5">
        {finishes.map((f) => (
          <div key={f} className="flex items-center gap-2 text-xs md:text-sm">
            <FinishIcon finish={f} size={15} />
            <span className="font-medium">{FINISH_INFO[f].label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Página
// ─────────────────────────────────────────────────────────────────────────────
export default function ColoresPage() {
  const total = COLORS.length;
  const interiorCount = COLORS.filter((c) => c.finishes.includes("interior")).length;
  const bicapaMateCount = COLORS.filter((c) => c.bicapaMate).length;

  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Header />

      <main data-header-theme="dark" className="min-h-screen bg-black text-white">
        {/* HERO */}
        <section className="relative overflow-hidden pt-32 pb-12 md:pt-40 md:pb-16">
          <div className="mx-auto max-w-[1500px] px-6 text-center md:px-10">
            <RainbowTitle text="Carta de color." />
          </div>
        </section>

        {/* COLLAGE */}
        <section className="pb-32 md:pb-44">
          <div className="mx-auto max-w-[1500px] px-4 md:px-8">
            <CollageWall colors={COLORS} />
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/10 py-20 md:py-28">
          <div className="mx-auto max-w-[1000px] px-6 text-center md:px-10">
            <h3 className="text-[clamp(2rem,5vw,4rem)] leading-tight" style={{ fontFamily: "var(--font-bagel)" }}>
              Encontraste tu color.
              <br /> ¿Vamos por tu aviso?
            </h3>
            <a
              href="/avisos"
              data-cursor="hover"
              className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-medium uppercase tracking-wider text-white backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/20 md:text-base"
            >
              Ver productos
              <span aria-hidden>→</span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function isDark(hex: string): boolean {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum < 0.55;
}
