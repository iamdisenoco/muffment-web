"use client";

import { motion } from "motion/react";
import { Logo } from "./Logo";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-cobalt text-cream">
      {/* Decoraciones — estrellas y triángulos como en el catálogo */}
      <Decorations />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1600px] flex-col items-center justify-center px-6 pb-20 pt-32 text-center md:px-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Logo variant="white" size={160} withLink={false} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.21, 0.6, 0.35, 1] }}
          className="mt-12 max-w-[20ch] text-[clamp(3rem,9vw,9.5rem)] font-normal leading-[0.9] tracking-tight"
          style={{ fontFamily: "var(--font-bagel)" }}
        >
          creative signs <br /> for creative <br /> businesses
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
      {/* Estrellas */}
      {[
        { top: "12%", left: "8%", size: 28, delay: 0.5 },
        { top: "18%", right: "12%", size: 38, delay: 0.7 },
        { bottom: "22%", left: "16%", size: 22, delay: 0.9 },
        { bottom: "35%", right: "18%", size: 32, delay: 1.1 },
        { top: "45%", left: "5%", size: 18, delay: 1.3 },
      ].map((pos, i) => (
        <motion.svg
          key={`star-${i}`}
          viewBox="0 0 24 24"
          width={pos.size}
          height={pos.size}
          className="absolute fill-cream/70"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            bottom: pos.bottom,
          }}
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: pos.delay, ease: "backOut" }}
        >
          <path d="M12 1l2.59 7.41L22 11l-7.41 2.59L12 21l-2.59-7.41L2 11l7.41-2.59L12 1z" />
        </motion.svg>
      ))}

      {/* Triángulos */}
      {[
        { top: "30%", right: "8%", rotate: 0, delay: 1 },
        { bottom: "12%", left: "10%", rotate: 90, delay: 1.2 },
      ].map((pos, i) => (
        <motion.svg
          key={`tri-${i}`}
          viewBox="0 0 24 24"
          width={36}
          height={36}
          className="absolute fill-cream/40"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            bottom: pos.bottom,
            transform: `rotate(${pos.rotate}deg)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: pos.delay }}
        >
          <path d="M12 2L2 22h20L12 2z" />
        </motion.svg>
      ))}
    </div>
  );
}
