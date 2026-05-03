"use client";

import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";
import { ProductRain } from "./ProductRain";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-cobalt text-cream">
      {/* Decoraciones — estrellas y triángulos como en el catálogo */}
      <Decorations />

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
            creative
          </motion.span>{" "}
          <motion.span
            className="inline-block"
            animate={{ scale: [1, 1.025, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3.5 }}
          >
            signs
          </motion.span>{" "}
          <br /> for{" "}
          <motion.span
            className="inline-block"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          >
            creative
          </motion.span>{" "}
          <br />{" "}
          <motion.span
            className="inline-block"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          >
            businesses
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
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link
            href="/avisos"
            data-cursor="hover"
            className="rounded-full bg-white px-8 py-4 text-base font-medium uppercase tracking-wider text-cobalt transition-colors hover:bg-cream-light"
          >
            Ver el catálogo
          </Link>
          <Link
            href="/manifiesto"
            data-cursor="hover"
            className="rounded-full border border-cream/40 px-8 py-4 text-base font-medium uppercase tracking-wider text-cream transition-colors hover:bg-cream/10"
          >
            Manifiesto
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-cream/60"
        >
          ▷ scroll ▷
        </motion.div>
      </div>
    </section>
  );
}

function Decorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Estrellas — entran con pop y luego flotan + rotan en loop infinito */}
      {[
        { top: "12%", left: "8%", size: 28, delay: 0.5, floatY: 12, floatDur: 4.5, rotDur: 8 },
        { top: "18%", right: "12%", size: 38, delay: 0.7, floatY: 16, floatDur: 5.2, rotDur: 10 },
        { bottom: "22%", left: "16%", size: 22, delay: 0.9, floatY: 10, floatDur: 4, rotDur: 7 },
        { bottom: "35%", right: "18%", size: 32, delay: 1.1, floatY: 14, floatDur: 5.6, rotDur: 9 },
        { top: "45%", left: "5%", size: 18, delay: 1.3, floatY: 8, floatDur: 3.6, rotDur: 6 },
      ].map((pos, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            bottom: pos.bottom,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: pos.delay, ease: "backOut" }}
        >
          {/* Inner: float vertical en loop */}
          <motion.div
            animate={{ y: [0, -pos.floatY, 0] }}
            transition={{
              duration: pos.floatDur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: pos.delay,
            }}
          >
            {/* Inner-inner: rotación continua del SVG */}
            <motion.svg
              viewBox="0 0 24 24"
              width={pos.size}
              height={pos.size}
              className="fill-cream/70"
              animate={{ rotate: 360 }}
              transition={{
                duration: pos.rotDur,
                repeat: Infinity,
                ease: "linear",
                delay: pos.delay,
              }}
            >
              <path d="M12 1l2.59 7.41L22 11l-7.41 2.59L12 21l-2.59-7.41L2 11l7.41-2.59L12 1z" />
            </motion.svg>
          </motion.div>
        </motion.div>
      ))}

      {/* Triángulos — fade-in y bobbing + rotación lenta */}
      {[
        { top: "30%", right: "8%", baseRotate: 0, delay: 1, floatY: 14, floatDur: 5, rotDur: 14 },
        { bottom: "12%", left: "10%", baseRotate: 90, delay: 1.2, floatY: 10, floatDur: 4.5, rotDur: 12 },
      ].map((pos, i) => (
        <motion.div
          key={`tri-${i}`}
          className="absolute"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            bottom: pos.bottom,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: pos.delay }}
        >
          <motion.div
            animate={{ y: [0, -pos.floatY, 0] }}
            transition={{
              duration: pos.floatDur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: pos.delay,
            }}
          >
            <motion.svg
              viewBox="0 0 24 24"
              width={36}
              height={36}
              className="fill-cream/40"
              style={{ transformOrigin: "center" }}
              animate={{ rotate: [pos.baseRotate, pos.baseRotate + 360] }}
              transition={{
                duration: pos.rotDur,
                repeat: Infinity,
                ease: "linear",
                delay: pos.delay,
              }}
            >
              <path d="M12 2L2 22h20L12 2z" />
            </motion.svg>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
