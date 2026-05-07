"use client";

/**
 * /post — pagina dedicada para generar el reel/story de Instagram
 * (9:16, 1080×1920) por default.
 *
 * Misma compo del Hero pero SIN:
 *   - header / nav
 *   - footer
 *   - botones CTA
 *   - "Scroll to explore"
 *   - subtitulo
 *
 * Solo: lluvia de avisos + titulo + muñequito asomando.
 * Listo para screen-record o screenshot.
 *
 * Aspect ratios via query:
 *   /post           -> 9:16 reel/story (1080×1920) — default
 *   /post?ar=4-5    -> 4:5 portrait    (1080×1350)
 *   /post?ar=1-1    -> 1:1 square      (1080×1080)
 */

import Image from "next/image";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ProductRain } from "@/components/ProductRain";

const LETTER_COLORS = ["#ff6b35", "#f9c80e", "#06d6a0", "#ef476f", "#4cc9f0"];

function HoverLetters({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block transition-colors duration-150 ease-out"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLSpanElement).style.color =
              LETTER_COLORS[i % LETTER_COLORS.length];
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLSpanElement).style.color = "";
          }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </>
  );
}

const ASPECT_RATIOS: Record<string, { w: number; h: number; label: string }> = {
  "4-5":  { w: 1080, h: 1350, label: "Portrait 4:5" },
  "1-1":  { w: 1080, h: 1080, label: "Square 1:1" },
  "9-16": { w: 1080, h: 1920, label: "Reel 9:16" },
};

function PostInner() {
  const params = useSearchParams();
  const ar = params.get("ar") ?? "9-16";
  const dims = ASPECT_RATIOS[ar] ?? ASPECT_RATIOS["9-16"];

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      {/* El frame mantiene aspect ratio EXACTO y se escala para que SIEMPRE
          quepa en el viewport. container-type: size habilita unidades cqw/cqh
          adentro para que TODO escale en proporcion al frame, no al viewport. */}
      <div
        className="post-frame relative overflow-hidden bg-cobalt text-cream shadow-2xl"
        style={{
          width: `min(100vw - 32px, calc((100vh - 32px) * ${dims.w} / ${dims.h}), ${dims.w}px)`,
          height: `min((100vw - 32px) * ${dims.h} / ${dims.w}, 100vh - 32px, ${dims.h}px)`,
          containerType: "size",
        }}
      >
        {/* Lluvia de avisos en los costados — scale 0.9 (cerca del original
            del Hero) para que se vean bien grandes en el reel. */}
        <ProductRain scale={0.9} />

        {/* Composición central — solo titulo + muñeco. absolute inset-0
            para que ocupe toda la altura del contenedor con aspect-ratio. */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.21, 0.6, 0.35, 1] }}
            className="post-title relative font-normal leading-[0.92] tracking-tight"
            style={{
              fontFamily: "var(--font-bagel)",
              // Diagramacion de 3 lineas (igual al home):
              //   creative signs
              //   for creative
              //   brands.
              // 14cqw = "creative signs" (~14 chars) cabe en una linea sin
              // overflow en frame 9:16. Si subo mas, "creative signs"
              // partiria letra por letra.
              fontSize: "clamp(2.5rem, 14cqw, 18rem)",
            }}
          >
            {/* Muñequito asomando JUSTO ARRIBA y CENTRADO sobre el titulo,
                "sentado" sobre el primer renglon. Tamaño relativo al frame. */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -6 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-[58%]"
              aria-hidden
            >
              <motion.div
                animate={{ y: [0, -3, 0, 2, 0], rotate: [0, 1.2, 0, -1.2, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              >
                <Image
                  src="/logos/muneco-cream.svg"
                  alt=""
                  width={300}
                  height={239}
                  priority
                  unoptimized
                  className="h-auto"
                  style={{
                    clipPath: "inset(0 0 62% 0)",
                    width: "clamp(80px, 20cqw, 240px)",
                  }}
                />
              </motion.div>
            </motion.div>

            <motion.span
              className="inline-block"
              animate={{ scale: [1, 1.035, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <HoverLetters text="creative" />
            </motion.span>{" "}
            <motion.span
              className="inline-block"
              animate={{ scale: [1, 1.025, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3.5 }}
            >
              <HoverLetters text="signs" />
            </motion.span>{" "}
            <br /> <HoverLetters text="for" />{" "}
            <motion.span
              className="inline-block"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            >
              <HoverLetters text="creative" />
            </motion.span>{" "}
            <br />{" "}
            <motion.span
              className="inline-block"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            >
              <HoverLetters text="brands" />
            </motion.span>
            .
          </motion.h1>
        </div>

        {/* Etiqueta de formato (solo visible en preview, NO al recortar) */}
        <div className="pointer-events-none absolute right-2 top-2 z-50 rounded-full bg-black/40 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-cream/70 backdrop-blur-sm">
          {dims.label} ({dims.w}×{dims.h})
        </div>
      </div>
    </div>
  );
}

export default function PostPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-black text-cream">Cargando…</div>}>
      <PostInner />
    </Suspense>
  );
}
