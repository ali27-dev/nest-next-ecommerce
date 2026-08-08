"use client";

import { useState } from "react";
import { TopUtilityBar } from "@/components/layout/header/top-utility-bar";
import { MainNavBar } from "@/components/layout/header/main-nav-bar";
import { SearchOverlay } from "@/components/layout/header/search-overlay";
import { ContactCard } from "@/components/layout/header/contact-card";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <TopUtilityBar
        onSearchClick={() => setSearchOpen((s) => !s)}
        onContactClick={() => setContactOpen(true)}
      />
      <MainNavBar />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ContactCard open={contactOpen} onClose={() => setContactOpen(false)} />
    </header>
  );
}
