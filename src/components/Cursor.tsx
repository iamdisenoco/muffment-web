"use client";

import { useEffect, useRef } from "react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
      }
    };

    // Hover sobre elementos interactivos: el punto crece un poco para feedback.
    const onEnter = () => dotRef.current?.classList.add("scale-[1.8]");
    const onLeave = () => dotRef.current?.classList.remove("scale-[1.8]");

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
      style={{ transition: "scale 200ms ease-out" }}
    />
  );
}
