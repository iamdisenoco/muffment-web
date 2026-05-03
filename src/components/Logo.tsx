import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "color" | "white";

const SRC: Record<Variant, string> = {
  color: "/logos/muffment-color.svg",
  white: "/logos/muffment-white.svg",
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
      height={Math.round(size * 1.25)}
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
