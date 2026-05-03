"use client";

import Link from "next/link";
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
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        // Sin barra de fondo: header transparente, los pills son los que tienen visibilidad
      )}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-4 md:px-10">
        <Logo variant="icon" size={48} />
        <nav
          className={cn(
            "hidden items-center gap-2 rounded-full px-2 py-2 transition-all duration-300 md:flex",
            scrolled
              ? "bg-white/90 shadow-sm backdrop-blur-md"
              : "bg-white/70 backdrop-blur-md",
          )}
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-cursor="hover"
              className="rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider text-cobalt transition-colors hover:bg-cobalt hover:text-cream"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/avisos"
          data-cursor="hover"
          className="rounded-full bg-cobalt px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-cream transition-colors hover:bg-cobalt-dark md:text-sm"
        >
          Ver productos
        </Link>
      </div>
    </header>
  );
}
