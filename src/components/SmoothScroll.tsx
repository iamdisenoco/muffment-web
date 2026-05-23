"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

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

    // 🔑 Sync Lenis ↔ GSAP ScrollTrigger — sin esto los triggers se
    // calculan contra el scroll nativo y la inercia de Lenis desfasaria
    // todas las animaciones (Awwwards-skill recommendation).
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      lenis.destroy();
    };
  }, []);

  return null;
}
