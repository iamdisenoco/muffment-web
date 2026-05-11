"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  hero: string;
  gallery?: string[];
  video?: string;
  alt: string;
  fallbackCode?: string;
  fallbackName?: string;
};

type Item = { type: "image" | "video"; src: string };

export function ProductGallery({
  hero,
  gallery = [],
  video,
  alt,
  fallbackCode,
  fallbackName,
}: Props) {
  // Items: hero + gallery (solo del 2026) + video al final si existe
  const images = [hero, ...gallery].filter((img) => img.includes("/2026/"));
  const items: Item[] = [
    ...images.map((src) => ({ type: "image" as const, src })),
    ...(video ? [{ type: "video" as const, src: video }] : []),
  ];
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  const next = useCallback(
    () => setActive((i) => (i + 1) % items.length),
    [items.length],
  );
  const prev = useCallback(
    () => setActive((i) => (i - 1 + items.length) % items.length),
    [items.length],
  );

  // Teclado: flechas para navegar, Escape para cerrar zoom
  useEffect(() => {
    if (!zoom) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") setZoom(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [zoom, next, prev]);

  // Si NO hay items (todo placeholder)
  if (items.length === 0) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-white md:aspect-[4/3]">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white via-white to-white">
          <div className="text-center px-6">
            <span
              className="block text-[14vw] leading-none text-cobalt md:text-[10rem]"
              style={{ fontFamily: "var(--font-bagel)" }}
            >
              {fallbackCode}
            </span>
            <span className="mt-4 block text-base font-medium uppercase tracking-wider text-black/60">
              {fallbackName}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const current = items[active];
  const showArrows = items.length > 1;

  return (
    <>
      {/* HERO grande con flechas + click para zoom */}
      <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-black/10 bg-[#f7f7f5] shadow-sm md:aspect-[4/3]">
        {current.type === "video" ? (
          <video
            src={current.src}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-contain"
            aria-label={alt}
          />
        ) : (
          <button
            type="button"
            onClick={() => setZoom(true)}
            className="absolute inset-0 cursor-zoom-in"
            aria-label="Ampliar imagen"
            data-cursor="hover"
          >
            <Image
              src={current.src}
              alt={alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-contain"
            />
          </button>
        )}

        {showArrows && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Foto anterior"
              data-cursor="hover"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-cobalt/85 p-3 text-cream opacity-0 transition-opacity hover:bg-cobalt group-hover:opacity-100 md:left-5 md:p-4"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Foto siguiente"
              data-cursor="hover"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-cobalt/85 p-3 text-cream opacity-0 transition-opacity hover:bg-cobalt group-hover:opacity-100 md:right-5 md:p-4"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-cobalt/85 px-3 py-1 text-xs font-medium uppercase tracking-wider text-cream">
              {active + 1} / {items.length}
            </span>
          </>
        )}
      </div>

      {/* THUMBNAILS */}
      {items.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5">
          {items.map((it, i) => (
            <button
              key={it.src}
              type="button"
              onClick={() => setActive(i)}
              data-cursor="hover"
              aria-label={it.type === "video" ? "Ver video" : `Ver foto ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative aspect-square overflow-hidden rounded-2xl border border-black/10 bg-[#f7f7f5] transition-all",
                i === active
                  ? "ring-2 ring-cobalt ring-offset-2 ring-offset-white"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              {it.type === "video" ? (
                <>
                  <video
                    src={it.src}
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                  <span className="pointer-events-none absolute bottom-1 right-1 rounded-full bg-cobalt/85 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cream">
                    VIDEO
                  </span>
                </>
              ) : (
                <Image
                  src={it.src}
                  alt={`${alt} — vista ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 25vw, 15vw"
                  className="object-contain"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* LIGHTBOX (solo para imágenes, no para video) */}
      {zoom && current.type === "image" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} ampliada`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-cobalt/95 p-4 md:p-12"
          onClick={() => setZoom(false)}
        >
          <button
            type="button"
            onClick={() => setZoom(false)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 z-10 rounded-full bg-cream/15 p-3 text-cream transition-colors hover:bg-cream/25 md:right-8 md:top-8"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div
            className="relative h-full w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.src}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
            {showArrows && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Foto anterior"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-cream/15 p-4 text-cream transition-colors hover:bg-cream/25 md:left-6"
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Foto siguiente"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-cream/15 p-4 text-cream transition-colors hover:bg-cream/25 md:right-6"
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
                <span className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-cream/15 px-4 py-1.5 text-sm font-medium uppercase tracking-wider text-cream">
                  {active + 1} / {items.length}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
