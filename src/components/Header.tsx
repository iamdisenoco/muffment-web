"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { cn, whatsappLink } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/avisos", label: "Catálogo" },
  { href: "/clientes", label: "Clientes" },
  { href: "/manifiesto", label: "Manifiesto" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const pathname = usePathname();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ¿El header está sobre fondo cobalt (Hero del home)?
  // Solo aplica en `/` y mientras scrollY < 90vh aprox.
  const [vh, setVh] = useState(800);
  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onDark = pathname === "/" && scrollY < vh * 0.85;
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
              "rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition-all hover:scale-105 md:text-base",
              onDark
                ? "bg-cream text-cobalt hover:bg-white"
                : "bg-cobalt text-cream hover:bg-cobalt-dark",
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
