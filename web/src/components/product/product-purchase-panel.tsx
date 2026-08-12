"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SizeSelector } from "./size-selector";
import { useAuth } from "@/contexts/auth-context";
import { Product } from "@/types/product";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { isLoggedIn } = useAuth();
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const requiresSize = product.sizes.length > 0;
  const canAddToCart = product.stock > 0 && (!requiresSize || size !== null);
  const unitPrice = Number(product.price);
  const totalPrice = unitPrice * quantity;

  function handleAddToCart() {
    if (!isLoggedIn) {
      alert("Please log in to add items to your cart.");
      return;
    }
    if (requiresSize && !size) {
      alert("Please select a size.");
      return;
    }
    // Coming soon: real POST /cart/items call with { productId, quantity, size }
    // once the backend CartItem model supports a size field and the login
    // page is wired to store a real access token.
    alert(
      `Add to cart: ${product.name}, size ${
        size ?? "N/A"
      }, qty ${quantity} — coming soon.`
    );
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
        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </Button>
    </div>
  );
}
