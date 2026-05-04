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

export function Header() {
  const pathname = usePathname();
  const [scrollY, setScrollY] = useState(0);
  const [onDark, setOnDark] = useState(pathname === "/");

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
    recompute();
    window.addEventListener("scroll", recompute, { passive: true });
    window.addEventListener("resize", recompute);
    return () => {
      window.removeEventListener("scroll", recompute);
      window.removeEventListener("resize", recompute);
    };
  }, [pathname]);

  const scrolled = scrollY > 12;

  // Estilo de la píldora del nav central: bg + borde varían según fondo.
  const navPillBg = onDark
    ? "bg-cream/10 border border-cream/15 backdrop-blur-md"
    : "bg-cobalt/8 border border-cobalt/15 backdrop-blur-md";

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
              onDark
                ? "border-white/25 bg-white/10 text-white hover:border-white/45 hover:bg-white/20"
                : "border-cobalt/25 bg-cobalt/10 text-cobalt hover:border-cobalt/45 hover:bg-cobalt/20",
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
