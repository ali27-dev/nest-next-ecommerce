"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SizeSelector } from "./size-selector";
import { useCart } from "@/contexts/cart-context";
import { Product } from "@/types/product";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const requiresSize = product.sizes.length > 0;
  const canAddToCart = product.stock > 0 && (!requiresSize || size !== null);
  const unitPrice = Number(product.price);
  const totalPrice = unitPrice * quantity;

  function handleAddToCart() {
    if (requiresSize && !size) return;
    addItem(product, quantity, size);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-5">
      <SizeSelector sizes={product.sizes} selected={size} onSelect={setSize} />

      <div>
        <p className="text-sm font-medium mb-2">Quantity</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-10 w-10 rounded-md border flex items-center justify-center hover:bg-accent disabled:opacity-40"
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
            className="h-10 w-10 rounded-md border flex items-center justify-center hover:bg-accent disabled:opacity-40"
            aria-label="Increase quantity"
            disabled={quantity >= product.stock}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-sm text-muted-foreground">Total:</span>
        <span className="text-xl font-mono font-semibold">
          Rs {totalPrice.toLocaleString()}
        </span>
        {quantity > 1 && (
          <span className="text-xs text-muted-foreground">
            (Rs {unitPrice.toLocaleString()} × {quantity})
          </span>
        )}
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={!canAddToCart}
        className="h-12 text-base"
      >
        {product.stock === 0
          ? "Out of Stock"
          : justAdded
          ? "Added ✓"
          : "Add to Cart"}
      </Button>
    </div>
  );
}
