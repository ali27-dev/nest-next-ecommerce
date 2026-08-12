"use client";

import { useState } from "react";
import { TopUtilityBar } from "./top-utility-bar";
import { MainNavBar } from "./main-nav-bar";
import { SearchOverlay } from "./search-overlay";
import { ContactCard } from "./contact-card";
import type { Category } from "@/types/product";

export function Header({ categories }: { categories: Category[] }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <TopUtilityBar
        onSearchClick={() => setSearchOpen((s) => !s)}
        onContactClick={() => setContactOpen(true)}
      />
      <MainNavBar categories={categories} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ContactCard open={contactOpen} onClose={() => setContactOpen(false)} />
    </header>
  );
}
