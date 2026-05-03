"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    // Configuración cinematográfica estilo landonorris.com / awwwards:
    // - Duración alta para mucho momentum/inercia
    // - Easing personalizado tipo "cinematic ease-out" más pronunciado
    // - lerp suaviza las transiciones del wheel (interpolación)
    // - wheelMultiplier reduce un poco la velocidad del scroll del usuario
    //   para dar sensación de "amortiguación" rica
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => 1 - Math.pow(1 - t, 4), // easeOutQuart — más suave al final
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
      lerp: 0.075,
      syncTouch: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  return null;
}
