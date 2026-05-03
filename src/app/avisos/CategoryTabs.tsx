"use client";

import Link from "next/link";
import { CATEGORIES, type ProductCategory } from "@/data/products";
import { cn } from "@/lib/utils";

export function CategoryTabs({ current }: { current?: ProductCategory }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/avisos"
        data-cursor="hover"
        className={cn(
          "rounded-full px-5 py-2.5 text-sm font-medium uppercase tracking-wider transition-colors",
          !current
            ? "bg-cobalt text-cream"
            : "bg-cobalt/10 text-cobalt hover:bg-cobalt/20",
        )}
      >
        Todos
      </Link>
      {CATEGORIES.map((c) => (
        <Link
          key={c.id}
          href={`/avisos?cat=${c.id}`}
          data-cursor="hover"
          className={cn(
            "rounded-full px-5 py-2.5 text-sm font-medium uppercase tracking-wider transition-colors",
            current === c.id
              ? "bg-cobalt text-cream"
              : "bg-cobalt/10 text-cobalt hover:bg-cobalt/20",
          )}
        >
          {c.label}
        </Link>
      ))}
    </div>
  );
}
