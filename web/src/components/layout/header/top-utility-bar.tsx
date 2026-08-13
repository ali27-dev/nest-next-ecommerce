// src/components/layout/header/top-utility-bar.tsx
"use client";

import Link from "next/link";
import { Phone, MessageCircle, Search, User, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";

interface TopUtilityBarProps {
  onSearchClick: () => void;
  onContactClick: () => void;
}

export function TopUtilityBar({
  onSearchClick,
  onContactClick,
}: TopUtilityBarProps) {
  const { totalItems } = useCart();

  return (
    <div className="w-full border-b bg-background">
      <div className="grid grid-cols-3 items-center h-16 px-4 sm:px-6 md:px-10 gap-2">
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
          className="justify-self-center whitespace-nowrap text-lg sm:text-xl md:text-2xl font-semibold tracking-tight"
        >
          Farzara Store
        </Link>

        <div className="flex items-center gap-0.5 sm:gap-1 justify-self-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 sm:h-12 sm:w-12"
            onClick={onSearchClick}
            aria-label="Search"
          >
            <Search className="h-5 w-5 sm:h-7 sm:w-7" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 sm:h-12 sm:w-12"
            asChild
          >
            <Link href="/account" aria-label="Account">
              <User className="h-5 w-5 sm:h-7 sm:w-7" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 sm:h-12 sm:w-12 relative"
            asChild
          >
            <Link href="/cart" aria-label="View cart">
              <ShoppingCart className="h-5 w-5 sm:h-7 sm:w-7" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-medium flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
