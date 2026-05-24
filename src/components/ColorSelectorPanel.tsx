"use client";

/**
 * ColorSelectorPanel — bloque completo del lado derecho del hero:
 *  - Título "Escoge tu color"
 *  - Mandala mini (carta de color compacta)
 *  - Botón "Agregar al carrito" sticky glassmorphism iridescent magnetic
 *
 * Aún por agregar (próxima iteración): preview del aviso en color seleccionado.
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ColorMandalaMini } from "@/components/ColorMandalaMini";

export function ColorSelectorPanel() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={wrapperRef} className="flex flex-col items-center gap-4">
      {/* Título curveado ARRIBA del mandala (su propio slot, con separación) */}
      <CurvedTitle text="ESCOGE TU COLOR" width={240} height={70} />

      {/* Mandala compacto */}
      <div style={{ width: "240px" }}>
        <ColorMandalaMini maxSize={240} />
      </div>

      {/* Botón glassmorphism rainbow magnetic */}
      <MagneticIridescentButton />
    </div>
  );
}

/**
 * Título curveado en SVG: las letras siguen un path circular en el arco
 * superior del mandala. Glow neón blanco aplicado vía SVG filter.
 */
function CurvedTitle({ text, width, height }: { text: string; width: number; height: number }) {
  /* SVG width×height. El círculo del path tiene su centro debajo del SVG
     (en y = height + offset) y un radio grande, así el arco superior queda
     SOLO dentro del SVG visible. El texto se ve como un arco amplio arriba. */
  const cx = width / 2;
  // Centro del círculo bajo el SVG → arco bien abierto, no muy curveado
  const cy = height + 220;
  const radius = cy - 6; // top del arco a y=6 (cerca del top del SVG)
  // Endpoints: donde el arco intersecta el bottom del SVG (y = height)
  // Para encontrarlos: y_top = cy - radius = 6. y_endpoint = height
  // dy = height - cy = height - (height + 220) = -220 → invalid
  // Mejor: endpoints en los lados del SVG (y = height), encontrar x.
  // x = cx ± sqrt(radius² - (height - cy)²)
  const dy = height - cy; // -220
  const dx = Math.sqrt(radius * radius - dy * dy);
  const x1 = cx - dx;
  const x2 = cx + dx;
  // sweep-flag = 1 → arco va sobre el centro (que está abajo) = ARCO SUPERIOR
  const pathD = `M ${x1.toFixed(3)},${height} A ${radius.toFixed(3)},${radius.toFixed(3)} 0 0,1 ${x2.toFixed(3)},${height}`;

  return (
    <svg
      aria-hidden
      className="pointer-events-none"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        {/* Filtro neón blanco — doble blur que crea aura */}
        <filter id="neon-glow-white" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b2" />
          <feFlood floodColor="rgba(255,255,255,0.9)" result="flood" />
          <feComposite in="flood" in2="b2" operator="in" result="glow2" />
          <feFlood floodColor="rgba(255,255,255,1)" result="flood1" />
          <feComposite in="flood1" in2="b1" operator="in" result="glow1" />
          <feMerge>
            <feMergeNode in="glow2" />
            <feMergeNode in="glow1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <path id="curve-title" d={pathD} fill="none" />
      </defs>
      <text
        fill="white"
        filter="url(#neon-glow-white)"
        style={{
          fontFamily: '"Satoshi", system-ui, sans-serif',
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.32em",
        }}
      >
        <textPath href="#curve-title" startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  );
}

/**
 * Botón con efecto cristal + tornasolado (conic-gradient animado rainbow)
 * + magnetic (sigue al cursor cuando está cerca).
 */
function MagneticIridescentButton() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 200;
      if (distance < maxDistance) {
        const strength = Math.pow(1 - distance / maxDistance, 1.5) * 0.4;
        setPos({ x: dx * strength, y: dy * strength });
      } else {
        setPos({ x: 0, y: 0 });
      }
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  /* Gradient rainbow horizontal usado en border + texto. 200% wide para
     que el shift en X lo haga loopear infinito sin saltos. */
  const rainbowGradient =
    "linear-gradient(90deg, #ff6b35, #f9c80e, #06d6a0, #4cc9f0, #3236b7, #ef476f, #ff6b35)";

  return (
    <motion.button
      ref={btnRef}
      type="button"
      data-cursor="hover"
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.6 }}
      className="relative inline-flex items-center justify-center rounded-full p-[2px]"
      style={{
        /* BORDE rainbow animado: el botón está dentro de un wrapper con
           padding 2px cuyo background es el gradient → se ve como border. */
        background: rainbowGradient,
        backgroundSize: "200% 100%",
        animation: "rainbow-shift 5s linear infinite",
        boxShadow: "0 10px 30px -8px rgba(0,0,0,0.35)",
      }}
    >
      <span
        className="relative flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white"
        style={{
          /* Glassmorphism CRISTAL más opaco para más contraste del texto blanco. */
          background: "rgba(20,22,82,0.78)",
          backdropFilter: "blur(14px) saturate(160%)",
          WebkitBackdropFilter: "blur(14px) saturate(160%)",
          fontFamily: '"Satoshi", system-ui, sans-serif',
          /* Sombra sutil para que el texto blanco resalte contra el fondo. */
          textShadow: "0 1px 2px rgba(0,0,0,0.4)",
        }}
      >
        Agregar al carrito
      </span>
    </motion.button>
  );
}
