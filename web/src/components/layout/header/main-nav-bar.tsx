"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavItem } from "@/components/layout/header/nav-item";
import { categories } from "@/lib/nav-links";
import { useHoverIntent } from "@/hooks/use-hover-intent";
import { NavDrawer } from "@/components/layout/header/nav-drawer";
import { useState } from "react";

export function MainNavBar() {
  const { open: hovered, show, hide, forceClose } = useHoverIntent();
  const [pinned, setPinned] = useState(false);
  const drawerOpen = hovered || pinned;

  function closeDrawer() {
    setPinned(false);
    forceClose();
  }

  return (
    <div className="w-full border-b bg-background">
      <div className="grid grid-cols-[auto_1fr_auto] items-center h-16 px-6 md:px-10 gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12"
          onMouseEnter={show}
          onMouseLeave={hide}
          onClick={() => setPinned((p) => !p)}
          aria-label="Open menu"
          aria-expanded={drawerOpen}
        >
          <Menu className="h-10 w-10" />
        </Button>

        <nav
          className="hidden md:flex items-center justify-center"
          aria-label="Main categories"
        >
          <ul className="flex items-center gap-8 list-none m-0 p-0">
            {categories.map((category) => (
              <li key={category.href}>
                <NavItem category={category} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Spacer matching the hamburger's width, so the nav visually centers in the full bar */}
        <div className="h-12 w-12" aria-hidden="true" />
      </div>

      <NavDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        onMouseEnter={show}
        onMouseLeave={hide}
      />
    </div>
  );
}
