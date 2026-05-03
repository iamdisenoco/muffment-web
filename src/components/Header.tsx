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
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 py-4 md:px-10">
        <Logo variant="icon" size={48} />
        {/* Items del menú flotando sueltos, sin background.
            mix-blend-difference garantiza visibilidad sobre cualquier fondo */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-cursor="hover"
              className="text-xs font-bold uppercase tracking-wider text-white mix-blend-difference transition-opacity hover:opacity-70 lg:text-sm"
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
