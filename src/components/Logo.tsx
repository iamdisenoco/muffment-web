import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "color" | "white" | "icon";

const SRC: Record<Variant, string> = {
  color: "/logos/muffment-color.svg",
  white: "/logos/muffment-white.svg",
  icon: "/logos/muffment-icon.svg", // muñeco en la bola azul, sin texto
};

// El icon tiene aspect ratio casi cuadrado (1634×1748)
// Los completos son verticales (1670×2091, ratio ~0.8:1)
const ASPECT: Record<Variant, number> = {
  color: 1.25,
  white: 1.25,
  icon: 1.07,
};

export function Logo({
  variant = "color",
  className,
  size = 56,
  withLink = true,
}: {
  variant?: Variant;
  className?: string;
  size?: number;
  withLink?: boolean;
}) {
  const img = (
    <Image
      src={SRC[variant]}
      alt="MUFFMENT"
      width={size}
      height={Math.round(size * ASPECT[variant])}
      priority
      unoptimized
      className={cn("h-auto", className)}
      style={{ width: size, height: "auto" }}
    />
  );
  if (!withLink) return img;
  return (
    <Link href="/" aria-label="MUFFMENT — Inicio" className="inline-flex items-center">
      {img}
    </Link>
  );
}
