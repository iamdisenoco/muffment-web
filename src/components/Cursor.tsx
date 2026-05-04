"use client";

import { useEffect, useRef } from "react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.documentElement.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let scale = 1;

    // Combinamos translate + scale en UN SOLO transform para que no se
    // sobreescriban entre sí (esa era la causa del "salto" del cursor al
    // hover). Cada update toca solo el style.transform.
    const apply = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0) scale(${scale})`;
      }
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      apply();
    };

    const onEnter = () => {
      scale = 2.2;
      apply();
    };
    const onLeave = () => {
      scale = 1;
      apply();
    };

    const interactive = "a, button, [data-cursor=hover]";
    const els = document.querySelectorAll<HTMLElement>(interactive);
    els.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      els.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="cursor-rainbow pointer-events-none fixed left-0 top-0 z-[9999] hidden h-2 w-2 rounded-full bg-current mix-blend-exclusion md:block"
      style={{ transition: "transform 120ms ease-out" }}
    />
  );
}
