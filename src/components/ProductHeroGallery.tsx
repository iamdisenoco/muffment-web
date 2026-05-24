"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ColorSelectorPanel } from "@/components/ColorSelectorPanel";

/**
 * Galería hero estilo Musotoku — secciones full-bleed con scroll-linked animations.
 *
 * Cada sección:
 *  - imagen: empieza con scale 1.08 (zoom-in) → scale 1.0 con el scroll
 *  - líneas L-shape: scaleX (horizontal) y scaleY (vertical) ligadas al scroll
 *  - cards: opacity + scale ligadas al scroll, staggered
 *
 * Todo es 100% scroll-driven: NO whileInView, NO timers. Si el usuario detiene
 * el scroll, las animaciones se pausan exactamente en ese estado.
 */

export type HeroBg =
  | "gradient-radial"
  | "gradient-vertical"
  | "blueprint"
  | "silk-cream"
  | "sparkles-cobalt"
  | "concrete-cream"
  | "diagonal-stripes";

export type Callout = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  side: "left" | "right";
  title: string;
  body: string;
  /** Si está presente, la card se convierte en botón link clickeable.
   *  Visual: agrega chevron y hover scale. */
  href?: string;
};

export type HeroImage = {
  src: string;
  alt: string;
  position?: string;
};

export type HeroSectionConfig = {
  bg: HeroBg;
  layout?: "single" | "split-2" | "triplet";
  images: HeroImage[];
  callouts?: Callout[];
  /** Si true: agrega `data-header-style="naked"` para que el Header
   *  muestre solo texto sin pill mientras esta sección está visible. */
  headerNaked?: boolean;
  /** Si true: agrega el módulo mini de carta de color a la derecha. */
  showColorMandala?: boolean;
};

type Props = {
  sections: HeroSectionConfig[];
  productName: string;
};

/* ════════════════════════════════════════════════════════════════
   COMPONENT ROOT
   ════════════════════════════════════════════════════════════════ */

export function ProductHeroGallery({ sections, productName }: Props) {
  return (
    <div className="relative w-full bg-white">
      {sections.map((section, i) => (
        <HeroSection
          key={`section-${i}`}
          section={section}
          productName={productName}
          index={i}
          total={sections.length}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION (scroll-linked)
   ════════════════════════════════════════════════════════════════ */

function HeroSection({
  section,
  productName,
  index,
  total,
}: {
  section: HeroSectionConfig;
  productName: string;
  index: number;
  total: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"], // progress: 0 cuando section entra viewport, 1 cuando sale
  });

  const isDarkSection =
    section.bg === "gradient-radial" ||
    section.bg === "gradient-vertical" ||
    section.bg === "sparkles-cobalt";

  const shadowFilter =
    section.bg === "silk-cream" || section.bg === "concrete-cream" || section.bg === "blueprint"
      ? "drop-shadow(0 50px 70px rgba(50,54,183,0.35)) drop-shadow(0 20px 30px rgba(0,0,0,0.18))"
      : "drop-shadow(0 60px 80px rgba(0,0,0,0.50)) drop-shadow(0 0 50px rgba(255,255,255,0.20))";

  const layout = section.layout ?? "single";

  // Zoom-out scroll-linked: la imagen empieza con scale 1.08 y va a 1.0
  // mientras el usuario scrollea por la primera mitad de la sección.
  const imageScale = useTransform(scrollYProgress, [0.15, 0.6], [1.08, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
      {...(isDarkSection ? { "data-header-theme": "dark" } : {})}
      {...(section.headerNaked ? { "data-header-style": "naked" } : {})}
    >
      <BgLayer variant={section.bg} />

      {layout === "single" && (
        <SingleImage
          img={section.images[0]}
          productName={productName}
          shadow={shadowFilter}
          priority={index === 0}
          scale={imageScale}
        />
      )}
      {layout === "split-2" && (
        <SplitTwoImages
          images={section.images.slice(0, 2)}
          productName={productName}
          shadow={shadowFilter}
          priority={index === 0}
          scale={imageScale}
        />
      )}
      {layout === "triplet" && (
        <TripletImages
          images={section.images.slice(0, 3)}
          productName={productName}
          shadow={shadowFilter}
          priority={index === 0}
          scale={imageScale}
        />
      )}

      {section.callouts && section.callouts.length > 0 && (
        <CalloutsOverlay
          callouts={section.callouts}
          isDarkSection={isDarkSection}
          scrollYProgress={scrollYProgress}
        />
      )}

      {/* Módulo mini carta de color (derecha) — comportamiento idéntico
          al mandala de /colores. Solo en secciones con showColorMandala.
          z-40 (sobre cards z-30) y visible desde sm+ para asegurar render. */}
      {section.showColorMandala && (
        <div
          className="pointer-events-auto absolute right-4 top-1/2 z-40 hidden -translate-y-1/2 sm:block md:right-10 lg:right-16"
          style={{ width: "260px" }}
        >
          <ColorSelectorPanel />
        </div>
      )}

      {/* Counter top-right */}
      <div className="pointer-events-none absolute right-6 top-6 z-30 md:right-10 md:top-10">
        <div
          className={`text-[11px] uppercase tracking-[0.3em] ${
            isDarkSection ? "text-cream/65" : "text-cobalt/55"
          }`}
          style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
        >
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   LAYOUTS de imagen (con zoom-out scroll-linked)
   ════════════════════════════════════════════════════════════════ */

function SingleImage({
  img,
  productName,
  shadow,
  priority,
  scale,
}: {
  img: HeroImage;
  productName: string;
  shadow: string;
  priority: boolean;
  scale: MotionValue<number>;
}) {
  if (!img) return null;
  return (
    <div className="relative z-10 flex h-full w-full items-stretch justify-center">
      <motion.div className="relative h-full w-full" style={{ scale }}>
        <Image
          src={img.src}
          alt={`${productName} — ${img.alt}`}
          fill
          priority={priority}
          quality={100}
          sizes="100vw"
          className="object-contain"
          style={{ filter: shadow, objectPosition: img.position ?? "center" }}
        />
      </motion.div>
    </div>
  );
}

function SplitTwoImages({
  images,
  productName,
  shadow,
  priority,
  scale,
}: {
  images: HeroImage[];
  productName: string;
  shadow: string;
  priority: boolean;
  scale: MotionValue<number>;
}) {
  return (
    <motion.div className="relative z-10 grid h-full w-full grid-cols-2 gap-0" style={{ scale }}>
      {images.map((img, i) => (
        <div key={i} className="relative h-full w-full">
          <Image
            src={img.src}
            alt={`${productName} — ${img.alt}`}
            fill
            priority={priority}
            quality={100}
            sizes="50vw"
            className="object-contain p-4 md:p-8"
            style={{ filter: shadow, objectPosition: img.position ?? "center" }}
          />
        </div>
      ))}
    </motion.div>
  );
}

function TripletImages({
  images,
  productName,
  shadow,
  priority,
  scale,
}: {
  images: HeroImage[];
  productName: string;
  shadow: string;
  priority: boolean;
  scale: MotionValue<number>;
}) {
  return (
    <motion.div
      className="relative z-10 grid h-full w-full grid-cols-12 gap-2 p-4 md:gap-4 md:p-8"
      style={{ scale }}
    >
      <div className="relative col-span-7 h-full w-full">
        {images[0] && (
          <Image
            src={images[0].src}
            alt={`${productName} — ${images[0].alt}`}
            fill
            priority={priority}
            quality={100}
            sizes="58vw"
            className="object-contain"
            style={{ filter: shadow, objectPosition: images[0].position ?? "center" }}
          />
        )}
      </div>
      <div className="col-span-5 grid h-full grid-rows-2 gap-2 md:gap-4">
        {images.slice(1, 3).map((img, i) => (
          <div key={i} className="relative h-full w-full">
            <Image
              src={img.src}
              alt={`${productName} — ${img.alt}`}
              fill
              priority={priority}
              quality={100}
              sizes="42vw"
              className="object-contain"
              style={{ filter: shadow, objectPosition: img.position ?? "center" }}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   CALLOUTS — scroll-linked líneas + cards
   ════════════════════════════════════════════════════════════════ */

function CalloutsOverlay({
  callouts,
  isDarkSection,
  scrollYProgress,
}: {
  callouts: Callout[];
  isDarkSection: boolean;
  scrollYProgress: MotionValue<number>;
}) {
  /* Cada callout ocupa una "ventana" del scroll progress. Más temprana
     (windowStart 0.10) para que aparezcan rápido apenas el usuario empieza
     a scrollear por la sección. Stagger 0.08 entre callouts. */
  return (
    <>
      {callouts.map((c, i) => {
        const windowStart = 0.10 + i * 0.08;
        const windowEnd = windowStart + 0.18;
        return (
          <ScrollLinkedCallout
            key={i}
            callout={c}
            scrollYProgress={scrollYProgress}
            windowStart={windowStart}
            windowEnd={windowEnd}
            isDarkSection={isDarkSection}
          />
        );
      })}
    </>
  );
}

function ScrollLinkedCallout({
  callout: c,
  scrollYProgress,
  windowStart,
  windowEnd,
  isDarkSection,
}: {
  callout: Callout;
  scrollYProgress: MotionValue<number>;
  windowStart: number;
  windowEnd: number;
  isDarkSection: boolean;
}) {
  const span = windowEnd - windowStart;
  // Timeline relativa al window (más rápida, card aparece antes):
  //  0% → 25%: línea H crece
  //  25% → 45%: línea V crece
  //  40% → 100%: card fade-in + scale up (overlap con vertical para que se vea juntas)
  const hStart = windowStart;
  const hEnd = windowStart + span * 0.25;
  const vStart = windowStart + span * 0.25;
  const vEnd = windowStart + span * 0.45;
  const cardStart = windowStart + span * 0.40;
  const cardEnd = windowStart + span * 0.85;

  const lineScaleX = useTransform(scrollYProgress, [hStart, hEnd], [0, 1]);
  const lineScaleY = useTransform(scrollYProgress, [vStart, vEnd], [0, 1]);
  const lineHOpacity = useTransform(scrollYProgress, [hStart, hStart + span * 0.05], [0, 1]);
  const lineVOpacity = useTransform(scrollYProgress, [vStart, vStart + span * 0.05], [0, 1]);
  const cardOpacity = useTransform(scrollYProgress, [cardStart, cardEnd], [0, 1]);
  const cardScale = useTransform(scrollYProgress, [cardStart, cardEnd], [0.92, 1]);

  const bg = isDarkSection ? "rgba(232,226,209,0.75)" : "rgba(50,54,183,0.65)";

  // Geometría L-shape
  const hLeft = Math.min(c.fromX, c.toX);
  const hWidth = Math.abs(c.fromX - c.toX);
  const hOrigin = c.fromX < c.toX ? "left" : "right";
  const vTop = Math.min(c.fromY, c.toY);
  const vHeight = Math.abs(c.fromY - c.toY);
  const vOrigin = c.fromY < c.toY ? "top" : "bottom";

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute z-20"
        style={{
          left: `${hLeft}%`,
          top: `${c.fromY}%`,
          width: `${hWidth}%`,
          height: "1.5px",
          background: bg,
          transformOrigin: hOrigin,
          scaleX: lineScaleX,
          opacity: lineHOpacity,
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute z-20"
        style={{
          left: `${c.toX}%`,
          top: `${vTop}%`,
          width: "1.5px",
          height: `${vHeight}%`,
          background: bg,
          transformOrigin: vOrigin,
          scaleY: lineScaleY,
          opacity: lineVOpacity,
        }}
      />
      <ScrollLinkedCard
        callout={c}
        opacity={cardOpacity}
        scale={cardScale}
        isDarkSection={isDarkSection}
      />
    </>
  );
}

function ScrollLinkedCard({
  callout: c,
  opacity,
  scale,
  isDarkSection,
}: {
  callout: Callout;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  isDarkSection: boolean;
}) {
  const cardCls = isDarkSection
    ? "border border-white/20 bg-white/10 text-cream backdrop-blur-md"
    : "border border-cobalt/20 bg-cobalt/10 text-ink backdrop-blur-md";

  const positioningTransform =
    c.side === "right"
      ? "translate(8px, -50%)"
      : "translate(calc(-100% - 8px), -50%)";

  const isButton = !!c.href;

  /* pointer-events: si es botón, auto para recibir click; sino none */
  const pointerCls = isButton ? "pointer-events-auto" : "pointer-events-none";

  const cardInner = (
    <motion.div
      style={{ opacity, scale }}
      className={`max-w-[280px] rounded-[32px] px-6 py-4 ${cardCls} ${
        isButton ? "transition-all hover:scale-[1.03] hover:shadow-lg cursor-pointer" : ""
      }`}
    >
      <div
        className={`mb-1 text-[10px] uppercase tracking-[0.25em] ${
          isDarkSection ? "text-cream/65" : "text-cobalt/65"
        }`}
        style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
      >
        {c.title}
      </div>
      <p
        className="flex items-center gap-2 text-sm font-medium leading-snug tracking-wide"
        style={{
          fontFamily: "var(--font-sans)",
          color: isDarkSection ? "rgba(232,226,209,0.95)" : "rgba(50,54,183,0.92)",
        }}
      >
        <span>{c.body}</span>
        {isButton && (
          <span
            aria-hidden
            className={`ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-base ${
              isDarkSection ? "bg-cream/15 text-cream" : "bg-cobalt/15 text-cobalt"
            }`}
          >
            →
          </span>
        )}
      </p>
    </motion.div>
  );

  return (
    <div
      className={`absolute z-30 hidden md:block ${pointerCls}`}
      style={{
        left: `${c.toX}%`,
        top: `${c.toY}%`,
        transform: positioningTransform,
      }}
    >
      {isButton ? (
        <Link href={c.href!} data-cursor="hover">
          {cardInner}
        </Link>
      ) : (
        cardInner
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   FONDOS (sin cambios)
   ════════════════════════════════════════════════════════════════ */

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.45 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function BgLayer({ variant }: { variant: HeroBg }) {
  switch (variant) {
    case "gradient-radial":
      return <BgGradientRadial />;
    case "gradient-vertical":
      return <BgGradientVertical />;
    case "blueprint":
      return <BgBlueprint />;
    case "silk-cream":
      return <BgSilkCream />;
    case "sparkles-cobalt":
      return <BgSparklesCobalt />;
    case "concrete-cream":
      return <BgConcreteCream />;
    case "diagonal-stripes":
      return <BgDiagonalStripes />;
  }
}

function BgGradientRadial() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, #f2ede0 0%, #e8e2d1 25%, #4549d4 70%, #252890 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-0 opacity-25 mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL }}
      />
    </>
  );
}

function BgGradientVertical() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, #f2ede0 0%, #e8e2d1 30%, #4549d4 85%, #252890 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-0 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL }}
      />
    </>
  );
}

function BgBlueprint() {
  return (
    <>
      <div aria-hidden className="absolute inset-0 z-0 bg-cream" />
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(50,54,183,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(50,54,183,0.10) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(50,54,183,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(50,54,183,0.18) 1px, transparent 1px)",
          backgroundSize: "320px 320px",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-0 opacity-30 mix-blend-multiply"
        style={{ backgroundImage: NOISE_URL }}
      />
    </>
  );
}

function BgSilkCream() {
  const SILK_URL =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'><defs><filter id='s'><feTurbulence type='turbulence' baseFrequency='0.013 0.025' numOctaves='3' seed='3'/><feColorMatrix values='0 0 0 0 0.91  0 0 0 0 0.89  0 0 0 0 0.82  0 0 0 0.6 0'/></filter></defs><rect width='100%' height='100%' fill='%23e8e2d1' filter='url(%23s)'/></svg>\")";
  return (
    <>
      <div aria-hidden className="absolute inset-0 z-0 bg-cream" />
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: SILK_URL,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(50,54,183,0.18) 100%)",
        }}
      />
    </>
  );
}

function BgSparklesCobalt() {
  return (
    <>
      <div aria-hidden className="absolute inset-0 z-0 bg-cobalt" />
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.25) 100%)",
        }}
      />
      {SPARKLE_DOTS.map((s, i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute z-0 rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: s.color,
            opacity: s.opacity,
            filter: `blur(${s.blur}px)`,
            boxShadow: `0 0 ${s.glow}px ${s.color}`,
          }}
        />
      ))}
      <div
        aria-hidden
        className="absolute inset-0 z-0 opacity-25 mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL }}
      />
    </>
  );
}

const SPARKLE_DOTS = [
  { x: 8, y: 12, size: 4, color: "#ff6b35", opacity: 0.9, blur: 0, glow: 8 },
  { x: 15, y: 78, size: 3, color: "#f9c80e", opacity: 0.85, blur: 0, glow: 6 },
  { x: 22, y: 35, size: 2, color: "#ffffff", opacity: 0.7, blur: 0, glow: 4 },
  { x: 30, y: 88, size: 5, color: "#06d6a0", opacity: 0.85, blur: 0, glow: 10 },
  { x: 38, y: 18, size: 3, color: "#ef476f", opacity: 0.9, blur: 0, glow: 7 },
  { x: 45, y: 62, size: 2, color: "#ffffff", opacity: 0.6, blur: 0, glow: 3 },
  { x: 55, y: 8, size: 4, color: "#4cc9f0", opacity: 0.85, blur: 0, glow: 9 },
  { x: 62, y: 45, size: 3, color: "#f9c80e", opacity: 0.8, blur: 0, glow: 6 },
  { x: 70, y: 82, size: 5, color: "#ff6b35", opacity: 0.9, blur: 0, glow: 12 },
  { x: 78, y: 25, size: 2, color: "#ffffff", opacity: 0.7, blur: 0, glow: 4 },
  { x: 85, y: 58, size: 4, color: "#06d6a0", opacity: 0.85, blur: 0, glow: 9 },
  { x: 92, y: 38, size: 3, color: "#ef476f", opacity: 0.8, blur: 0, glow: 7 },
  { x: 12, y: 50, size: 2, color: "#ffffff", opacity: 0.55, blur: 0, glow: 3 },
  { x: 48, y: 92, size: 3, color: "#4cc9f0", opacity: 0.75, blur: 0, glow: 5 },
  { x: 73, y: 5, size: 2, color: "#ffffff", opacity: 0.65, blur: 0, glow: 4 },
];

function BgConcreteCream() {
  const CONCRETE_URL =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><defs><filter id='c'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' seed='7'/><feColorMatrix values='0 0 0 0 0.85  0 0 0 0 0.82  0 0 0 0 0.74  0 0 0 0.7 0'/></filter></defs><rect width='100%' height='100%' fill='%23d8d1bd' filter='url(%23c)'/></svg>\")";
  return (
    <>
      <div aria-hidden className="absolute inset-0 z-0 bg-cream-dark" />
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: CONCRETE_URL,
          backgroundSize: "600px 600px",
          backgroundRepeat: "repeat",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.20) 100%)",
        }}
      />
    </>
  );
}

function BgDiagonalStripes() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, #f2ede0 0%, #e8e2d1 40%, #4549d4 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-0 opacity-15"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(50,54,183,0.4) 0px, rgba(50,54,183,0.4) 1px, transparent 1px, transparent 24px)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-0 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: NOISE_URL }}
      />
    </>
  );
}
