"use client";

import Link from "next/link";
import { X, LogOut, LogIn, HelpCircle, Phone, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { getCategoryIcon } from "@/lib/category-icons";
import type { Category } from "@/types/product";
import { useCart } from "@/contexts/cart-context";

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  categories: Category[];
}

export function NavDrawer({
  open,
  onClose,
  onMouseEnter,
  onMouseLeave,
  categories,
}: NavDrawerProps) {
  const { clear: clearCart } = useCart();
  const { isLoggedIn, logout } = useAuth();

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-200",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      />
      <aside
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 flex flex-col bg-background border-r shadow-xl transition-transform duration-200 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-14 px-5 border-b shrink-0">
          <span className="font-semibold text-lg">Menu</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto" aria-label="Shop by category">
          <ul className="flex flex-col py-2 list-none m-0 p-0">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.slug);
              return (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-5 py-3 text-base hover:bg-accent transition-colors"
                  >
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    {category.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {isLoggedIn && (
          <Link
            href="/orders"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Package className="h-5 w-5" /> Order History
          </Link>
        )}

        <div className="mt-auto border-t py-2">
          <Link
            href="/help"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <HelpCircle className="h-5 w-5" /> Help &amp; Support
          </Link>
          <a
            href="tel:+920000000000"
            className="flex items-center gap-3 px-5 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Phone className="h-5 w-5" /> Contact Us
          </a>

          {isLoggedIn ? (
            <button
              onClick={() => {
                logout();
                onClose();
                clearCart();
              }}
              className="flex w-full items-center gap-3 px-5 py-3 text-sm text-destructive hover:bg-accent transition-colors"
            >
              <LogOut className="h-5 w-5" /> Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center gap-3 px-5 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogIn className="h-5 w-5" /> Login
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
