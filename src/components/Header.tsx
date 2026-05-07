"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
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

        {/* Hablemos — pill que abre WhatsApp */}
        <div className="flex flex-1 justify-end">
          <a
            href={whatsappLink(
              "Hola MUFFMENT, quisiera saber más de los avisos.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className={cn(
              "rounded-full border px-5 py-2.5 text-sm font-medium tracking-wide backdrop-blur-md transition-all hover:scale-105 md:text-base",
              // Glass mucho mas contrastado para que se vea bien en cualquier
              // fondo (especialmente en /colores donde el bg es negro puro).
              onDark
                ? "border-white/45 bg-white/15 text-white hover:border-white/70 hover:bg-white/25"
                : "border-cobalt/40 bg-cobalt/15 text-cobalt hover:border-cobalt/60 hover:bg-cobalt/25",
              scrolled && "shadow-md",
            )}
          >
            ¡Hablemos!
          </a>
        </div>
      </div>
    </header>
  );
}
