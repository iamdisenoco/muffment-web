"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

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

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 py-4 md:px-10">
        {/* Logo: muñeco cream sobre cobalt, cobalt sobre blanco */}
        <Logo variant={onDark ? "icon-cream" : "icon"} size={48} />

        {/* Items del menú — sin uppercase, color adaptado al fondo */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-cursor="hover"
              className={cn(
                "text-base font-medium tracking-wide transition-opacity hover:opacity-60 lg:text-lg",
                onDark ? "text-cream" : "text-cobalt",
              )}
              style={{ fontFamily: "var(--font-bagel)" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Ver productos — pill grande y prominente */}
        <Link
          href="/avisos"
          data-cursor="hover"
          className={cn(
            "rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide shadow-md transition-all hover:scale-105 md:text-base",
            onDark
              ? "bg-cream text-cobalt hover:bg-white"
              : "bg-cobalt text-cream hover:bg-cobalt-dark",
            scrolled && "shadow-lg",
          )}
          style={{ fontFamily: "var(--font-bagel)" }}
        >
          Ver productos
        </Link>
      </div>
    </header>
  );
}
