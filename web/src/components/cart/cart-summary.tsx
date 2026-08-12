"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";

export function CartSummary() {
  const { subtotal, totalItems } = useCart();
  const { isLoggedIn } = useAuth();

  function handleCheckout() {
    if (!isLoggedIn) {
      alert("Please log in to check out.");
      return;
    }
    // Coming soon: real POST /orders/checkout call once login exists.
    alert("Checkout — coming soon.");
  }

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

      <Button
        onClick={handleCheckout}
        disabled={totalItems === 0}
        className="w-full h-12"
      >
        Checkout
      </Button>
    </div>
  );
}
