"use client";

import { useEffect, useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SizeSelector } from "./size-selector";
import { useCart } from "@/contexts/cart-context";
import { Product } from "@/types/product";

interface QuickAddModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickAddModal({ product, onClose }: QuickAddModalProps) {
  const { addItem } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const open = Boolean(product);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSize(null);
    setQuantity(1);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!product) return null;

  const requiresSize = product.sizes.length > 0;
  const canAdd = product.stock > 0 && (!requiresSize || size !== null);
  const hasDiscount =
    product.compareAtPrice &&
    Number(product.compareAtPrice) > Number(product.price);

  function handleAddToCart() {
    if (!product || !canAdd) return;
    addItem(product, quantity, size);
    onClose();
  }

  return (
    <div
      onClick={onClose}
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Quick add ${product.name}`}
        className={cn(
          "w-full max-w-2xl bg-background rounded-xl shadow-2xl overflow-hidden transition-all duration-200 flex flex-col sm:flex-row",
          open ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-background/90 flex items-center justify-center hover:bg-accent"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative w-full sm:w-2/5 aspect-[3/4] bg-muted shrink-0">
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex-1 p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-base font-medium">{product.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  Rs. {Number(product.compareAtPrice).toLocaleString()}
                </span>
              )}
              <span className="text-base font-semibold">
                Rs. {Number(product.price).toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs font-medium text-destructive">
                  FREE DELIVERY
                </span>
              )}
            </div>
          </div>

          <SizeSelector
            sizes={product.sizes}
            selected={size}
            onSelect={setSize}
          />

          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-9 w-9 rounded-md border flex items-center justify-center hover:bg-accent disabled:opacity-40"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-medium">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="h-9 w-9 rounded-md border flex items-center justify-center hover:bg-accent disabled:opacity-40"
              aria-label="Increase quantity"
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={!canAdd}
            className="h-11 mt-auto"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
