"use client";

import { Search, X, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { Product, ProductListResponse } from "@/types/product";
import { useRouter } from "next/navigation";

const seasonShortcuts = [
  { label: "Summer", query: "season=SUMMER" },
  { label: "Winter", query: "season=WINTER" },
  { label: "1 Piece", query: "pieceCount=ONE_PIECE" },
  { label: "2 Piece", query: "pieceCount=TWO_PIECE" },
  { label: "3 Piece", query: "pieceCount=THREE_PIECE" },
  { label: "Sale", query: "onSale=1" },
];

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      apiFetch<ProductListResponse>(
        `/products?search=${encodeURIComponent(query.trim())}&limit=8`
      )
        .then((res) => setResults(res.products))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function handleSubmit() {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose();
  }
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
          "fixed left-1/2 top-6 z-[60] w-[92vw] max-w-2xl -translate-x-1/2 rounded-xl bg-background shadow-2xl border transition-all duration-200 max-h-[80vh] overflow-hidden flex flex-col",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <div className="flex items-center gap-3 px-5 h-16 border-b shrink-0">
          <Search className="h-6 w-6 text-muted-foreground shrink-0" />
          <input
            autoFocus={open}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            type="search"
            placeholder="Search by name, SKU, or ID..."
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
          />
          {loading && (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground shrink-0" />
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          {!query.trim() && (
            <>
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Quick filters
              </p>
              <div className="flex flex-wrap gap-2">
                {seasonShortcuts.map((s) => (
                  <Link
                    key={s.label}
                    href={`/search?${s.query}`}
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-full border text-sm hover:bg-accent transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </>
          )}

          {query.trim() && !loading && results.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No products found for &quot;{query}&quot;.
            </p>
          )}

          {results.length > 0 && (
            <div className="flex flex-col gap-1">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="h-14 w-12 rounded-md overflow-hidden bg-muted shrink-0">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      SKU {product.sku}
                    </p>
                  </div>
                  <p className="text-sm font-mono shrink-0">
                    Rs {Number(product.price).toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
