"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useHoverIntent } from "@/hooks/use-hover-intent";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/product";

export function NavItem({ category }: { category: Category }) {
  const { open, show, hide, forceClose } = useHoverIntent();

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <Link
        href={`/category/${category.id}`}
        onClick={forceClose}
        className="flex items-center gap-1 py-5 text-base font-medium text-foreground/80 hover:text-foreground transition-colors"
      >
        {category.name}
        <ChevronDown className="h-4 w-4" />
      </Link>

      <div
        className={cn(
          "absolute left-0 top-full w-48 rounded-md border bg-popover shadow-lg py-2 transition-all duration-150 origin-top",
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <Link
          href={`/category/${category.id}`}
          onClick={forceClose}
          className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
        >
          Shop All
        </Link>
        <Link
          href={`/category/${category.id}?sort=newest`}
          onClick={forceClose}
          className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
        >
          New Arrivals
        </Link>
      </div>
    </div>
  );
}
