"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { CartIcon } from "./CartIcon";
import { cn, whatsappLink } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/avisos", label: "Productos" },
  { href: "/colores", label: "Carta de color" },
  { href: "/clientes", label: "Clientes" },
  { href: "/manifiesto", label: "Manifiesto" },
  { href: "/contacto", label: "Contacto" },
];

// Línea (en px desde el borde superior de la ventana) en la que vive el
// centro vertical del header — ahí es donde tomamos la "muestra" del fondo
// para decidir si la barra debe estar en modo claro u oscuro.
const HEADER_PROBE_Y = 36;

// Paths cuyo TOP siempre es oscuro (bg-cobalt/black). Garantiza el estado
// correcto desde el primer paint, sin esperar al recompute del effect.
const DARK_TOP_PATHS = ["/", "/colores", "/manifiesto"];

export function Header() {
  const pathname = usePathname();
  const [scrollY, setScrollY] = useState(0);
  const startsDark = DARK_TOP_PATHS.some(
    (p) => pathname === p || (p !== "/" && pathname?.startsWith(p + "/")),
  );
  const [onDark, setOnDark] = useState(startsDark);

  useEffect(() => {
    // Recalcula tanto en scroll como en resize: en cada tick mira qué
    // sección con `data-header-theme="dark"` tiene su rectángulo cruzando
    // la línea HEADER_PROBE_Y. Si hay alguna, modo oscuro; si no, claro.
    const recompute = () => {
      setScrollY(window.scrollY);
      const sections = document.querySelectorAll<HTMLElement>(
        '[data-header-theme="dark"]',
      );
      let isDark = false;
      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= HEADER_PROBE_Y && rect.bottom > HEADER_PROBE_Y) {
          isDark = true;
          break;
        }
      }
      setOnDark(isDark);
    };
    // Doble ejecución para evitar timing donde el DOM aún no terminó
    // de hidratar al primer render del effect.
    recompute();
    requestAnimationFrame(recompute);
    const t = setTimeout(recompute, 100);
    window.addEventListener("scroll", recompute, { passive: true });
    window.addEventListener("resize", recompute);
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", recompute);
      window.removeEventListener("resize", recompute);
    };
  }, [pathname]);

  const scrolled = scrollY > 12;

  // Estilo de la píldora del nav central: bg + borde varían según fondo.
  const navPillBg = onDark
    ? "bg-white/10 border border-white/20 backdrop-blur-md"
    : "bg-cobalt/10 border border-cobalt/20 backdrop-blur-md";

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-4 md:px-10">
        {/* Logo izquierda */}
        <div className="flex-1">
          <Logo variant={onDark ? "icon-cream" : "icon"} size={44} />
        </div>

        {/* Nav central — píldora flotante estilo basement.studio */}
        <nav
          className={cn(
            "hidden items-center gap-1 rounded-full px-2 py-1.5 transition-colors duration-300 md:flex",
            navPillBg,
            scrolled && "shadow-sm",
          )}
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-cursor="hover"
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium tracking-wide transition-colors lg:text-[15px]",
                onDark
                  ? "text-cream/90 hover:bg-cream/15 hover:text-cream"
                  : "text-cobalt/85 hover:bg-cobalt/10 hover:text-cobalt",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Hablemos + Cart */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <CartIcon onDark={onDark} />
          <a
            href={whatsappLink(
              "Hola MUFFMENT, quisiera saber más de los avisos.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium tracking-wide backdrop-blur-md transition-all hover:scale-105 md:text-base",
              // Glass mucho mas contrastado para que se vea bien en cualquier
              // fondo (especialmente en /colores donde el bg es negro puro).
              onDark
                ? "border-white/45 bg-white/15 text-white hover:border-white/70 hover:bg-white/25"
                : "border-cobalt/40 bg-cobalt/15 text-cobalt hover:border-cobalt/60 hover:bg-cobalt/25",
              scrolled && "shadow-md",
            )}
          >
            <span
              aria-hidden
              className="inline-grid h-5 w-5 place-items-center rounded-full bg-[#25D366] text-white"
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.46 1.34 4.97L2 22l5.2-1.36c1.46.79 3.1 1.21 4.79 1.21h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04C17.16 3.04 14.66 2 12.04 2zm4.47 12.05c-.24-.12-1.45-.72-1.67-.8-.22-.08-.39-.12-.55.12-.16.24-.63.8-.78.96-.14.16-.29.18-.53.06-.24-.12-1.03-.38-1.97-1.21-.73-.65-1.22-1.45-1.36-1.69-.14-.24-.02-.37.1-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.47-.01-.16 0-.43.06-.65.3-.22.24-.85.83-.85 2.03 0 1.2.87 2.36.99 2.52.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z" />
              </svg>
            </span>
            ¡Hablemos!
          </a>
        </div>
      </div>
    </header>
  );
}
