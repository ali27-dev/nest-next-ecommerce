// src/components/layout/header/main-nav-bar.tsx
"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavItem } from "./nav-item";
import { useHoverIntent } from "@/hooks/use-hover-intent";
import { NavDrawer } from "./nav-drawer";
import { useRef, useState } from "react";
import type { Category } from "@/types/product";
// import { useAuth } from "@/contexts/auth-context";
// import Link from "next/link";

export function MainNavBar({ categories }: { categories: Category[] }) {
  // const { isLoggedIn } = useAuth();
  const { open: hovered, show, hide, forceClose } = useHoverIntent();
  const [pinned, setPinned] = useState(false);
  const suppressHoverRef = useRef(false);
  const drawerOpen = hovered || pinned;

  function closeDrawer() {
    setPinned(false);
    forceClose();

    // The drawer panel sits above the hamburger button, so closing it while
    // the cursor rests in that spot can trigger a fresh mouseenter on the
    // button underneath, instantly reopening it. Briefly ignore hover after
    // any programmatic close to prevent that loop.
    suppressHoverRef.current = true;
    setTimeout(() => {
      suppressHoverRef.current = false;
    }, 400);
  }

  function guardedShow() {
    if (suppressHoverRef.current) return;
    show();
  }

  return (
    <div className="w-full border-b bg-background">
      <div className="grid grid-cols-[auto_1fr_auto] items-center h-16 px-6 md:px-10 gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12"
          onMouseEnter={guardedShow}
          onMouseLeave={hide}
          onClick={() => setPinned((p) => !p)}
          aria-label="Open menu"
          aria-expanded={drawerOpen}
        >
          <Menu className="h-7 w-7" />
        </Button>

        <nav
          className="hidden md:flex items-center justify-center"
          aria-label="Main categories"
        >
          <ul className="flex items-center gap-8 list-none m-0 p-0">
            {categories.map((category) => (
              <li key={category.id}>
                <NavItem category={category} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="h-12 w-12" aria-hidden="true" />
      </div>

      <NavDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        categories={categories}
        onMouseEnter={guardedShow}
        onMouseLeave={hide}
      />
    </div>
  );
}
