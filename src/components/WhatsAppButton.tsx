"use client";

import { whatsappLink } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Props = {
  message?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function WhatsAppButton({
  message = "Hola MUFFMENT, quiero más info sobre sus avisos",
  children = "Escríbenos por WhatsApp",
  className,
  variant = "primary",
  size = "md",
}: Props) {
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  } as const;
  // Estilo cristal (glassmorphism) — bg semi-transparente + borde sutil +
  // backdrop-blur. Variantes para fondo oscuro (light text) y claro (dark text).
  const variants = {
    // Sobre fondos oscuros (cobalt, black, cream/10)
    primary:
      "border border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:border-white/40",
    // Sobre fondos claros (white, cream)
    ghost:
      "border border-cobalt/25 bg-cobalt/8 text-cobalt backdrop-blur-md hover:bg-cobalt/15 hover:border-cobalt/40",
  } as const;
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="hover"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200",
        sizes[size],
        variants[variant],
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-4 w-4 fill-current"
      >
        <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.46 1.34 4.97L2 22l5.2-1.36c1.46.79 3.1 1.21 4.79 1.21h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04C17.16 3.04 14.66 2 12.04 2zm0 18.16c-1.5 0-2.97-.4-4.25-1.16l-.3-.18-3.16.83.84-3.08-.2-.32a8.13 8.13 0 0 1-1.25-4.33c0-4.5 3.66-8.16 8.16-8.16 2.18 0 4.23.85 5.77 2.39a8.11 8.11 0 0 1 2.39 5.77c0 4.5-3.66 8.16-8.16 8.16zm4.47-6.11c-.24-.12-1.45-.72-1.67-.8-.22-.08-.39-.12-.55.12-.16.24-.63.8-.78.96-.14.16-.29.18-.53.06-.24-.12-1.03-.38-1.97-1.21-.73-.65-1.22-1.45-1.36-1.69-.14-.24-.02-.37.1-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.47-.01-.16 0-.43.06-.65.3-.22.24-.85.83-.85 2.03 0 1.2.87 2.36.99 2.52.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z" />
      </svg>
      {children}
    </a>
  );
}
