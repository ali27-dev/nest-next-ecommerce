"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/types/product";

export interface CartLine {
  product: Product;
  size: string | null;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  addItem: (product: Product, quantity: number, size: string | null) => void;
  updateQuantity: (
    productId: string,
    size: string | null,
    quantity: number
  ) => void;
  removeItem: (productId: string, size: string | null) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// Coming soon: replace this in-memory state with a real fetch from
// GET /cart on mount (once logged in), and route addItem/updateQuantity/
// removeItem through POST /cart/items, PATCH /cart/items/:id, and
// DELETE /cart/items/:id instead of local state.
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  function addItem(product: Product, quantity: number, size: string | null) {
    setLines((prev) => {
      const existing = prev.find(
        (l) => l.product.id === product.id && l.size === size
      );
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id && l.size === size
            ? { ...l, quantity: Math.min(l.quantity + quantity, product.stock) }
            : l
        );
      }
      return [...prev, { product, quantity, size }];
    });
  }

  function updateQuantity(
    productId: string,
    size: string | null,
    quantity: number
  ) {
    setLines((prev) =>
      prev
        .map((l) =>
          l.product.id === productId && l.size === size ? { ...l, quantity } : l
        )
        .filter((l) => l.quantity > 0)
    );
  }

  function removeItem(productId: string, size: string | null) {
    setLines((prev) =>
      prev.filter((l) => !(l.product.id === productId && l.size === size))
    );
  }

  function clear() {
    setLines([]);
  }

  const totalItems = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce(
    (sum, l) => sum + Number(l.product.price) * l.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        lines,
        addItem,
        updateQuantity,
        removeItem,
        clear,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
