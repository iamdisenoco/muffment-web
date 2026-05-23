"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  strength?: number;
  as?: "button" | "a";
  href?: string;
};

/**
 * Magnetic Button — el botón "se atrae" hacia el cursor cuando está cerca.
 * Patrón clásico awwwards (Active Theory, Studio Freight). El efecto es
 * sutil pero comunica "calidad premium" inmediatamente.
 */
export function MagneticButton({
  children,
  onClick,
  className,
  strength = 0.35,
  as = "button",
  href,
}: Props) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPos({ x, y });
  };
  const handleLeave = () => setPos({ x: 0, y: 0 });

  const baseClasses = cn(
    "inline-flex items-center justify-center transition-colors",
    className,
  );
  const transition = { type: "spring" as const, stiffness: 200, damping: 18, mass: 0.5 };

  if (as === "a") {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        animate={pos}
        transition={transition}
        data-cursor="hover"
        className={baseClasses}
      >
        <motion.span animate={{ x: pos.x * 0.4, y: pos.y * 0.4 }} transition={transition}>
          {children}
        </motion.span>
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={pos}
      transition={transition}
      data-cursor="hover"
      className={baseClasses}
    >
      <motion.span animate={{ x: pos.x * 0.4, y: pos.y * 0.4 }} transition={transition}>
        {children}
      </motion.span>
    </motion.button>
  );
}
