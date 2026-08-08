"use client";

import Link from "next/link";
import { useState } from "react";
import {
  User,
  Shirt,
  Watch,
  Footprints,
  SprayCan,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const categories = [
  { label: "Men", href: "/category/men", icon: User },
  { label: "Women", href: "/category/women", icon: Shirt },
  { label: "Watches", href: "/category/watches", icon: Watch },
  { label: "Shoes", href: "/category/shoes", icon: Footprints },
  { label: "Perfumes", href: "/category/perfumes", icon: SprayCan },
];

export function Sidebar() {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const expanded = pinned || hovered;

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "hidden md:flex flex-col shrink-0 overflow-hidden border-r bg-background transition-all duration-200 ease-in-out sticky top-16 h-[calc(100vh-4rem)]",
        expanded ? "w-56" : "w-16"
      )}
    >
      <button
        onClick={() => setPinned((p) => !p)}
        className="flex items-center justify-center h-12 border-b text-muted-foreground hover:text-foreground shrink-0"
        aria-label={pinned ? "Unpin sidebar" : "Pin sidebar open"}
      >
        {pinned ? (
          <PanelLeftClose className="h-5 w-5" />
        ) : (
          <PanelLeftOpen className="h-5 w-5" />
        )}
      </button>

      <nav className="flex flex-col gap-1 py-2">
        {categories.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span
              className={cn(
                "whitespace-nowrap transition-opacity duration-150",
                expanded ? "opacity-100" : "opacity-0"
              )}
            >
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
