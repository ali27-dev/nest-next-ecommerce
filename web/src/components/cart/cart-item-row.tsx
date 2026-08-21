"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { CartLine, useCart } from "@/contexts/cart-context";

export function CartItemRow({ line }: { line: CartLine }) {
  const { updateQuantity, removeItem } = useCart();
  const { product, size, quantity } = line;
  const lineTotal = Number(product.price) * quantity;

  return (
    <div className="flex gap-4 py-5 border-b">
      <Link href={`/products/${product.id}`} className="shrink-0">
        <div className="h-28 w-24 bg-muted rounded-lg overflow-hidden">
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </Link>

      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/products/${product.id}`}>
              <h3 className="text-sm font-medium">{product.name}</h3>
            </Link>
            {size && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Size: {size}
              </p>
            )}
          </div>
          <button
            onClick={() => removeItem(product.id, size)}
            aria-label="Remove item"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(product.id, size, quantity - 1)}
              className="h-8 w-8 rounded-md border flex items-center justify-center hover:bg-accent"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <button
              onClick={() =>
                updateQuantity(
                  product.id,
                  size,
                  Math.min(quantity + 1, product.stock)
                )
              }
              className="h-8 w-8 rounded-md border flex items-center justify-center hover:bg-accent"
              aria-label="Increase quantity"
              disabled={quantity >= product.stock}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-sm font-mono font-medium">
            Rs {lineTotal.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
