"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
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
const CART_STORAGE_KEY = "farzara_cart";

// Coming soon: sync this to the real GET/POST/PATCH/DELETE /cart endpoints
// so the cart persists across devices, not just this browser. localStorage
// is a same-device, client-only fix for the "cart disappears on refresh"
// problem in the meantime.
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted cart once, on first mount in the browser
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLines(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
    setHydrated(true);
  }, []);

  // Persist on every change, but only after the initial load above has
  // run — otherwise this would fire once with the empty initial state and
  // immediately overwrite whatever was saved before the load even happens.
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

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
