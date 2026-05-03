"use client";

import { useEffect, useRef } from "react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.documentElement.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
      }
    };

    const onEnter = () => ringRef.current?.classList.add("scale-[2.5]");
    const onLeave = () => ringRef.current?.classList.remove("scale-[2.5]");

    const interactive = "a, button, [data-cursor=hover]";
    const els = document.querySelectorAll<HTMLElement>(interactive);
    els.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    const tick = () => {
      // factor 1.0 = snap directo al cursor (sin lag)
      // mantenemos requestAnimationFrame por si queremos volver a interpolar más adelante
      ringX = mouseX;
      ringY = mouseY;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX - 16}px, ${ringY - 16}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      els.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="cursor-rainbow pointer-events-none fixed left-0 top-0 z-[9999] hidden h-8 w-8 rounded-full border-2 border-current mix-blend-exclusion md:block"
        style={{ transition: "scale 200ms ease-out" }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="cursor-rainbow pointer-events-none fixed left-0 top-0 z-[9999] hidden h-2 w-2 rounded-full bg-current mix-blend-exclusion md:block"
      />
    </>
  );
}
