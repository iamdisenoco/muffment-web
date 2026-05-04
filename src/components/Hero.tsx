"use client";

import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";
import { ProductRain } from "./ProductRain";
import { whatsappLink } from "@/lib/utils";

// Paleta para hover-por-letra del h1.
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
          {char === " " ? " " : char}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  return (
    <section data-header-theme="dark" className="relative min-h-[100svh] snap-start overflow-hidden bg-cobalt text-cream">
      {/* (Las decoraciones flotantes ahora son globales — ver
          <FloatingDecorations /> en layout.tsx) */}

      {/* Lluvia de productos a los costados */}
      <ProductRain />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1600px] flex-col items-center justify-center px-6 pb-20 pt-32 text-center md:px-10">
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.21, 0.6, 0.35, 1] }}
          className="relative max-w-[20ch] text-[clamp(3rem,9vw,9.5rem)] font-normal leading-[0.9] tracking-tight"
          style={{ fontFamily: "var(--font-bagel)" }}
        >
          {/* Muñequito asomando, color cream igual al texto, base tocando "creative" */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute left-[2%] top-0 z-20 -translate-y-[18%] md:left-[3%]"
            aria-hidden
          >
            {/* Idle breathing — el muñeco respira sutil */}
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
                className="h-auto w-[160px] md:w-[260px] lg:w-[320px]"
                style={{ clipPath: "inset(0 0 62% 0)" }}
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
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 max-w-2xl text-lg text-cream/85 md:text-xl"
        >
          Somos una nueva versión de los avisos tradicionales.
          <br />
          Diseñados y fabricados en Colombia ✦ Garantía por 3 años.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link
            href="/avisos"
            data-cursor="hover"
            className="rounded-full bg-white px-6 py-2.5 text-sm font-medium uppercase tracking-wider text-cobalt transition-colors hover:bg-cream-light"
          >
            Ver el catálogo
          </Link>
          <a
            href={whatsappLink(
              "Hola MUFFMENT, necesito un aviso a la medida. ¿Me ayudan con la cotización?",
            )}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="rounded-full border border-cream/40 px-6 py-2.5 text-center text-sm font-medium uppercase tracking-wider text-cream transition-colors hover:bg-cream/10"
          >
            Necesito un aviso a la medida
          </a>
        </motion.div>

        {/* Indicador de scroll — minimalista (sin pill ni border) para no
            competir con los CTAs de arriba. Texto + chevron en columna. */}
        <motion.a
          href="#segundo-slide"
          data-cursor="hover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="group absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-cream/55 transition-colors hover:text-cream"
        >
          Scroll to explore
          <motion.span
            aria-hidden
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="text-sm leading-none"
          >
            ↓
          </motion.span>
        </motion.a>
      </div>
    </section>
  );
}

