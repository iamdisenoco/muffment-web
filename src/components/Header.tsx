"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const NAV = [
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
        scrolled
          ? "bg-white/85 backdrop-blur-md border-b border-black/10"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 md:px-10">
        <Logo variant="icon" size={48} />
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium uppercase tracking-wider text-cobalt transition-opacity hover:opacity-60"
              data-cursor="hover"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/avisos"
          data-cursor="hover"
          className="rounded-full bg-cobalt px-5 py-2.5 text-sm font-medium uppercase tracking-wider text-cream transition-colors hover:bg-cobalt-dark"
        >
          Ver productos
        </Link>
      </div>
    </header>
  );
}
