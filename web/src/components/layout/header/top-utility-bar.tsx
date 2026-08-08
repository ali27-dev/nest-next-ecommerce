"use client";

import Link from "next/link";
import { Phone, MessageCircle, Search, User, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopUtilityBarProps {
  onSearchClick: () => void;
  onContactClick: () => void;
}

export function TopUtilityBar({
  onSearchClick,
  onContactClick,
}: TopUtilityBarProps) {
  return (
    <div className="w-full border-b bg-background">
      <div className="grid grid-cols-3 items-center h-14 px-6 md:px-10">
        <div className="hidden sm:flex items-center gap-5 text-muted-foreground">
          <a
            href="https://wa.me/923000000000"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp us"
            className="hover:text-foreground"
          >
            <MessageCircle className="h-6 w-6" />
          </a>
          <button
            onClick={onContactClick}
            aria-label="Contact us"
            className="hover:text-foreground"
          >
            <Phone className="h-6 w-6" />
          </button>
        </div>

        <Link
          href="/"
          className="justify-self-center text-2xl font-semibold tracking-tight"
        >
          Farzara Store
        </Link>

        <div className="flex items-center gap-1 justify-self-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12"
            onClick={onSearchClick}
            aria-label="Search"
          >
            <Search className="h-7 w-7" />
          </Button>
          <Button variant="ghost" size="icon" className="h-12 w-12" asChild>
            <Link href="/account" aria-label="Account">
              <User className="h-7 w-7" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-12 w-12" asChild>
            <Link href="/cart" aria-label="View cart">
              <ShoppingCart className="h-7 w-7" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
