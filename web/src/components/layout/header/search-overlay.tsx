"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Coming soon: wire this to a real GET /products?search= query once the
// backend supports filtering. For now these are static placeholder chips.
const popularSearches = [
  "Linen shirt",
  "Leather watch",
  "Perfume",
  "Sneakers",
  "Handbag",
];

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node))
        onClose();
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-[55] bg-black/40 transition-opacity duration-200",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      />
      <div
        ref={panelRef}
        className={cn(
          "fixed left-1/2 top-6 z-[60] w-[92vw] max-w-2xl -translate-x-1/2 rounded-xl bg-background shadow-2xl border transition-all duration-200",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <div className="flex items-center gap-3 px-5 h-16 border-b">
          <Search className="h-6 w-6 text-muted-foreground shrink-0" />
          <input
            autoFocus={open}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Search for products, brands..."
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-5">
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            Popular searches
          </p>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-3 py-1.5 rounded-full border text-sm hover:bg-accent transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Live product search results — coming soon.
          </p>
        </div>
      </div>
    </>
  );
}
