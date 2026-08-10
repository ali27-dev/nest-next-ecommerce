"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { ShoppingBag } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
  variant?: "default" | "icon";
}

export function AddToCartButton({
  productId,
  disabled,
  variant = "default",
}: AddToCartButtonProps) {
  const { isLoggedIn } = useAuth();

  function handleClick() {
    if (!isLoggedIn) {
      alert("Please log in to add items to your cart.");
      return;
    }
    alert(`Add to cart for product ${productId} — coming soon.`);
  }

  if (variant === "icon") {
    return (
      <Button
        onClick={handleClick}
        disabled={disabled}
        size="icon"
        className="h-11 w-11 rounded-full shadow-md"
        aria-label="Add to cart"
      >
        <ShoppingBag className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      className="w-full mt-3 h-9"
    >
      {disabled ? "Out of stock" : "Add to Cart"}
    </Button>
  );
}
