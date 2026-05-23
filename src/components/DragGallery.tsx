"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  alt: string;
  index: number;
  onChange: (idx: number) => void;
};

/**
 * Drag Gallery — inspirada en el "drag to reveal" del reel de Ford. La foto
 * se puede arrastrar horizontalmente; al soltar pasada de un threshold
 * cambia a la siguiente/anterior imagen. Además mantiene:
 *   - Flechas grandes a los lados (fallback + accesibilidad)
 *   - Cursor hint "DRAG" visible al hover sobre la foto
 *   - Mix-blend-mode: multiply para integrar con bg blanco
 *   - Drop-shadow cobalt cinematográfica
 */
export function DragGallery({ images, alt, index, onChange }: Props) {
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasMultiple = images.length > 1;
  const currentImg = images[index] ?? images[0];

  // Hint sutil de cuánto se está arrastrando (rotación pequeña)
  const rotate = useTransform(x, [-200, 0, 200], [-3, 0, 3]);
  const photoOpacity = useTransform(x, [-300, -150, 0, 150, 300], [0.4, 0.7, 1, 0.7, 0.4]);

  const goPrev = () =>
    onChange((index - 1 + images.length) % images.length);
  const goNext = () => onChange((index + 1) % images.length);

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number } },
  ) => {
    setIsDragging(false);
    const threshold = 100;
    if (info.offset.x > threshold) goPrev();
    else if (info.offset.x < -threshold) goNext();
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex w-full items-center justify-center"
      style={{ maxWidth: "min(76vh, 820px)" }}
    >
      {/* Flechas (fallback) */}
      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Anterior"
            data-cursor="hover"
            className="absolute -left-4 z-20 flex h-14 w-14 items-center justify-center text-cobalt/55 transition-all hover:scale-110 hover:text-cobalt md:-left-6"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Siguiente"
            data-cursor="hover"
            className="absolute -right-4 z-20 flex h-14 w-14 items-center justify-center text-cobalt/55 transition-all hover:scale-110 hover:text-cobalt md:-right-6"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Foto draggable — tamaño dominante (el producto es el héroe).
          La foto es aspect-square y se limita por la dimensión más chica
          del viewport. min(80vh, 820px) → en pantallas chicas no se sale,
          en pantallas grandes llega a 820px imponente. */}
      <motion.div
        drag={hasMultiple ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.25}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{
          x,
          rotate,
          opacity: photoOpacity,
        }}
        className={cn(
          "relative aspect-square w-full touch-pan-y",
          hasMultiple && "cursor-grab active:cursor-grabbing",
        )}
        data-cursor={hasMultiple ? "drag" : undefined}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImg}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.21, 0.6, 0.35, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={currentImg}
              alt={alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 820px"
              className="object-contain"
              style={{
                mixBlendMode: "multiply",
                filter: "drop-shadow(0 25px 35px rgba(50,54,183,0.12))",
              }}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Hint visual "DRAG" — aparece solo si hay múltiples imágenes y
            no se está arrastrando. Desaparece al primer drag. */}
        {hasMultiple && !isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-cobalt/15 bg-white/60 px-3 py-1.5 backdrop-blur-md"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-cobalt"
              aria-hidden
            >
              <polyline points="9 18 15 12 9 6" />
              <polyline points="15 18 21 12 15 6" />
            </svg>
            <span
              className="text-[9px] font-semibold uppercase tracking-[0.3em] text-cobalt"
              style={{ fontFamily: '"Satoshi", system-ui, sans-serif' }}
            >
              Drag
            </span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
