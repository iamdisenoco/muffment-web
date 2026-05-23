"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Product } from "@/data/products";

type Props = {
  product: Product;
  /** Si hay color picker activo, recibimos la url de la foto dinámica
   * (puede cambiar). Si no, usa la del producto. */
  heroOverride?: string;
};

/**
 * Pinned scroll-narrative section — inspirado en Coffee Lounge "USE PRE /
 * FRESH BEA" + Ford "REDISCOVER". Pinea la foto del producto en el centro
 * mientras la tipografía masiva atraviesa la pantalla.
 *
 * Estructura:
 *   - Wrapper alto (300vh) — define cuánto scroll cubre el efecto
 *   - Dentro: viewport pinned con foto sticky + 3 paneles de texto que
 *     se cruzan con el progreso del scroll
 *
 * Los tres mensajes son los pilares brand:
 *   1. DISEÑADO PARA DURAR
 *   2. NO SE OXIDA
 *   3. + DE 90 COLORES
 */
const PANELS = [
  { top: "DISEÑADO PARA", bottom: "DURAR", micro: "01 — Construcción" },
  { top: "NO SE", bottom: "OXIDA", micro: "02 — Garantía 3 años" },
  { top: "+ DE 90", bottom: "COLORES", micro: "03 — Pintura electrostática" },
];

export function ProductScrollNarrative({ product, heroOverride }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const photoSrc = heroOverride ?? product.hero;

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLDivElement>(".psn-panel");

      // Master timeline pinned: el viewport queda fijo mientras el scroll
      // avanza por los 3 paneles. Cada panel ocupa ~33% del total scroll.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=300%", // 3 viewports de scroll
          pin: true,
          scrub: 1,
        },
      });

      // Panel 1: empieza visible
      panels.forEach((panel, i) => {
        if (i === 0) return; // panel 0 ya está visible al inicio
        tl.to(
          panels[i - 1],
          { autoAlpha: 0, yPercent: -25, ease: "power2.in" },
          i - 1,
        ).fromTo(
          panel,
          { autoAlpha: 0, yPercent: 25 },
          { autoAlpha: 1, yPercent: 0, ease: "power2.out" },
          i - 1,
        );
      });

      // Foto: respira/zoom muy suave a lo largo del pin
      gsap.fromTo(
        ".psn-photo",
        { scale: 1 },
        {
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            end: "+=300%",
            scrub: true,
          },
        },
      );

      // Progress bar — del 0 al 100% del pin
      gsap.to(".psn-progress-bar", {
        scaleX: 1,
        ease: "none",
        transformOrigin: "left center",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=300%",
          scrub: true,
        },
      });
    },
    { scope: wrapperRef },
  );

  return (
    <section
      ref={wrapperRef}
      className="relative bg-cobalt text-cream"
      aria-label={`Por qué elegir ${product.name}`}
    >
      {/* Viewport pineado (100vh) */}
      <div className="relative h-screen overflow-hidden">
        {/* Foto sticky en el centro */}
        <div className="psn-photo absolute inset-0 flex items-center justify-center will-change-transform">
          <div className="relative aspect-[5/4] w-full max-w-[700px]">
            <Image
              src={photoSrc}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-contain"
              style={{
                filter:
                  "drop-shadow(0 30px 60px rgba(0,0,0,0.35)) brightness(1.05)",
              }}
            />
          </div>
        </div>

        {/* Paneles de tipografía superpuestos */}
        {PANELS.map((p, i) => (
          <div
            key={i}
            className="psn-panel pointer-events-none absolute inset-0 flex flex-col justify-between p-6 md:p-12"
            style={{
              opacity: i === 0 ? 1 : 0, // GSAP los va a manejar
            }}
          >
            {/* Micro-eyebrow top-left */}
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-12 bg-cream/40" />
              <p
                className="text-[10px] uppercase tracking-[0.4em] text-cream/70"
                style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
              >
                {p.micro}
              </p>
            </div>

            {/* Tipografía masiva — top de la pantalla */}
            <div className="relative">
              <h3
                className="select-none leading-[0.85] tracking-tight text-cream"
                style={{
                  fontFamily: "var(--font-bagel)",
                  fontSize: "clamp(3.5rem, 12vw, 14rem)",
                  mixBlendMode: "difference",
                }}
              >
                <span className="block">{p.top}</span>
                <span
                  className="block text-cream/40"
                  style={{ mixBlendMode: "difference" }}
                >
                  {p.bottom}
                </span>
              </h3>
            </div>

            {/* Indicador bottom-right */}
            <div className="flex items-center justify-end gap-3">
              <p
                className="text-[10px] uppercase tracking-[0.4em] text-cream/60"
                style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
              >
                {String(i + 1).padStart(2, "0")} / 0{PANELS.length}
              </p>
              <span aria-hidden className="h-px w-12 bg-cream/40" />
            </div>
          </div>
        ))}

        {/* Progress bar bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-cream/10">
          <div
            className="psn-progress-bar h-full origin-left bg-cream"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
