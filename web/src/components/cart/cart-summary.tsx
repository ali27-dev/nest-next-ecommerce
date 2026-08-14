"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";

export function CartSummary() {
  const { subtotal, totalItems } = useCart();
  const { isLoggedIn } = useAuth();

  return (
    <div className="border rounded-xl p-5 h-fit">
      <h2 className="text-base font-semibold mb-4">Order Summary</h2>

      <div className="flex justify-between text-sm mb-2">
        <span className="text-muted-foreground">
          Subtotal ({totalItems} items)
        </span>
        <span className="font-mono">Rs {subtotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-sm mb-4">
        <span className="text-muted-foreground">Shipping</span>
        <span className="text-muted-foreground">Calculated at checkout</span>
      </div>

      <div className="flex justify-between text-base font-semibold border-t pt-4 mb-5">
        <span>Total</span>
        <span className="font-mono">Rs {subtotal.toLocaleString()}</span>
      </div>

      <Button asChild disabled={totalItems === 0} className="w-full h-12">
        <Link href={isLoggedIn ? "/checkout" : "/login?redirect=/checkout"}>
          Checkout
        </Link>
      </Button>
    </div>
  );
}
