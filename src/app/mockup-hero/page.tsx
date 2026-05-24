import Image from "next/image";

/**
 * Mockup comparativo de 4 fondos para el hero Musotoku-style.
 * Ruta temporal — borrar tras decisión de Jon.
 * Cada sección es full-bleed (100vh) con el MISMO plegable-1-cutout
 * para que la comparación sea solo del bg.
 */

const HERO_IMG = "/img/products/2026/plegable-1-hero-v3.png"; // legacy mockup standalone

function OptionLabel({ tag, title, note }: { tag: string; title: string; note: string }) {
  return (
    <div className="absolute left-6 top-6 z-30 md:left-10 md:top-10">
      <div className="inline-flex flex-col gap-1 rounded-2xl bg-black/60 px-4 py-3 backdrop-blur-md">
        <span
          className="text-[10px] uppercase tracking-[0.3em] text-white/70"
          style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
        >
          Opción {tag}
        </span>
        <span
          className="text-base font-semibold text-white"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {title}
        </span>
        <span className="max-w-[280px] text-[11px] leading-snug text-white/60">{note}</span>
      </div>
    </div>
  );
}

function ProductHero({ shadow }: { shadow: string }) {
  return (
    <div className="relative z-10 flex h-full w-full items-stretch justify-center">
      {/* Producto OCUPA TODA la altura de la sección, top a bottom, sin margen */}
      <div className="relative h-full w-full">
        <Image
          src={HERO_IMG}
          alt="Hablador de Piso Plegable"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-contain"
          style={{ filter: shadow }}
        />
      </div>
    </div>
  );
}

/* SVG noise sutil reutilizable */
const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.45 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export default function MockupHero() {
  return (
    <main className="bg-white">
      {/* ─── OPCIÓN A · COBALT SÓLIDO + GRAIN ─────────────────── */}
      <section className="relative h-screen w-full overflow-hidden bg-cobalt">
        <div
          aria-hidden
          className="absolute inset-0 z-0 opacity-30 mix-blend-overlay"
          style={{ backgroundImage: NOISE_URL }}
        />
        {/* Glow blanco neón detrás del producto */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 z-0 h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(40px)",
          }}
        />
        <OptionLabel
          tag="A"
          title="Cobalt sólido + grain"
          note="Brand absoluto · contraste valla · producto vibra"
        />
        <ProductHero shadow="drop-shadow(0 60px 80px rgba(0,0,0,0.5)) drop-shadow(0 0 40px rgba(255,255,255,0.25))" />
      </section>

      {/* ─── OPCIÓN B · CREAM TEXTURIZADO + SOMBRA COBALT ──────── */}
      <section className="relative h-screen w-full overflow-hidden bg-cream">
        <div
          aria-hidden
          className="absolute inset-0 z-0 opacity-40 mix-blend-multiply"
          style={{ backgroundImage: NOISE_URL }}
        />
        {/* Pool de sombra cobalt difusa abajo (anchor el producto al piso) */}
        <div
          aria-hidden
          className="absolute bottom-0 left-1/2 z-0 h-[30vh] w-[80vh] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(50,54,183,0.45) 0%, rgba(50,54,183,0) 70%)",
            filter: "blur(60px)",
          }}
        />
        <OptionLabel
          tag="B"
          title="Cream texturizado + sombra cobalt"
          note="Editorial Aesop/Hermès · respeta los 88 colores"
        />
        <ProductHero shadow="drop-shadow(0 40px 60px rgba(50,54,183,0.35)) drop-shadow(0 20px 30px rgba(0,0,0,0.15))" />
      </section>

      {/* ─── OPCIÓN C · GRADIENT RADIAL COBALT→CREAM ──────────── */}
      <section
        className="relative h-screen w-full overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at center, #f2ede0 0%, #e8e2d1 25%, #4549d4 70%, #252890 100%)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 z-0 opacity-25 mix-blend-overlay"
          style={{ backgroundImage: NOISE_URL }}
        />
        <OptionLabel
          tag="C"
          title="Gradient radial cobalt → cream"
          note="Studio shot · profundidad cinematográfica · drama"
        />
        <ProductHero shadow="drop-shadow(0 50px 70px rgba(0,0,0,0.45)) drop-shadow(0 0 60px rgba(255,255,255,0.2))" />
      </section>

      {/* ─── OPCIÓN D · CREAM + FLOATING RAINBOW XL ──────────── */}
      <section className="relative h-screen w-full overflow-hidden bg-cream">
        <div
          aria-hidden
          className="absolute inset-0 z-0 opacity-35 mix-blend-multiply"
          style={{ backgroundImage: NOISE_URL }}
        />

        {/* Floating rainbow shapes XL detrás del producto */}
        <Star color="#ff6b35" className="left-[8%] top-[18%] h-[180px] w-[180px] rotate-12 opacity-40 blur-[1px]" />
        <Triangle color="#06d6a0" className="right-[12%] top-[22%] h-[220px] w-[220px] -rotate-12 opacity-35" />
        <Dot color="#ef476f" className="left-[20%] bottom-[15%] h-[140px] w-[140px] opacity-35 blur-[2px]" />
        <Star color="#f9c80e" className="right-[8%] bottom-[20%] h-[200px] w-[200px] -rotate-45 opacity-40" />
        <Triangle color="#4cc9f0" className="left-[42%] top-[8%] h-[160px] w-[160px] rotate-45 opacity-30 blur-[1px]" />

        <OptionLabel
          tag="D"
          title="Cream + floating rainbow XL"
          note="Identidad MUFFMENT clarísima · ningún producto se pierde"
        />
        <ProductHero shadow="drop-shadow(0 40px 60px rgba(50,54,183,0.30)) drop-shadow(0 15px 25px rgba(0,0,0,0.18))" />
      </section>

      {/* Spacer final con instrucción */}
      <section className="flex h-[40vh] items-center justify-center bg-white">
        <p
          className="text-center text-gray-500"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Fin del mockup · scrollea para arriba para comparar las 4 opciones
        </p>
      </section>
    </main>
  );
}

/* ─── Shapes auxiliares ──────────────────────────────────── */

function Star({ color, className }: { color: string; className: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`pointer-events-none absolute z-0 ${className}`}
      fill={color}
    >
      <path d="M50 0 L61 39 L100 39 L69 61 L80 100 L50 76 L20 100 L31 61 L0 39 L39 39 Z" />
    </svg>
  );
}

function Triangle({ color, className }: { color: string; className: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`pointer-events-none absolute z-0 ${className}`}
      fill={color}
    >
      <path d="M50 5 L95 90 L5 90 Z" />
    </svg>
  );
}

function Dot({ color, className }: { color: string; className: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`pointer-events-none absolute z-0 ${className}`}
      fill={color}
    >
      <circle cx="50" cy="50" r="45" />
    </svg>
  );
}
