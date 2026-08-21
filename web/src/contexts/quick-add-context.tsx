"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/types/product";
import { QuickAddModal } from "@/components/product/quick-add-model";

interface QuickAddContextValue {
  openQuickAdd: (product: Product) => void;
}

const QuickAddContext = createContext<QuickAddContextValue | undefined>(
  undefined
);

export function QuickAddProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);

  return (
    <QuickAddContext.Provider value={{ openQuickAdd: setProduct }}>
      {children}
      <QuickAddModal product={product} onClose={() => setProduct(null)} />
    </QuickAddContext.Provider>
  );
}

export function useQuickAdd() {
  const ctx = useContext(QuickAddContext);
  if (!ctx) throw new Error("useQuickAdd must be used within QuickAddProvider");
  return ctx;
}
