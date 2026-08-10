"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useHoverIntent } from "@/hooks/use-hover-intent";
import { cn } from "@/lib/utils";
import type { NavCategory } from "@/lib/nav-links";

export function NavItem({ category }: { category: NavCategory }) {
  const { open, show, hide } = useHoverIntent();
  const hasDropdown = Boolean(category.subLinks?.length);

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <Link
        href={category.href}
        className={cn(
          "flex items-center gap-1.5 py-5 text-base font-medium transition-colors",
          category.highlight
            ? "text-destructive"
            : "text-foreground/80 hover:text-foreground"
        )}
      >
        {category.label}
        {hasDropdown && <ChevronDown className="h-4 w-4" />}
      </Link>

      {hasDropdown && (
        <div
          className={cn(
            "absolute left-0 top-full w-48 rounded-md border bg-popover shadow-lg py-2 transition-all duration-150 origin-top",
            open
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          )}
        >
          {category.subLinks!.map((sub) => (
            <Link
              key={sub.href}
              href={sub.href}
              className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
