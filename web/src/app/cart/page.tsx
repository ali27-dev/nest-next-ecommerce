"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { CartSummary } from "@/components/cart/cart-summary";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { lines } = useCart();

  if (lines.length === 0) {
    return (
      <div className="px-6 md:px-10 py-24 flex flex-col items-center text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-lg font-semibold">Your cart is empty</h1>
        <p className="text-sm text-muted-foreground mt-1 mb-6">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Button asChild className="h-11 px-8">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10 py-8">
      <h1 className="text-xl font-semibold mb-6">Shopping Cart</h1>
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          {lines.map((line) => (
            <CartItemRow
              key={`${line.product.id}-${line.size ?? "none"}`}
              line={line}
            />
          ))}
        </div>
        <CartSummary />
      </div>
    </div>
  );
}
