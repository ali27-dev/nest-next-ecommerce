"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { Product } from "@/types/product";
import { ShoppingBag } from "lucide-react";

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
  variant?: "default" | "icon";
}

export function AddToCartButton({
  product,
  disabled,
  variant = "default",
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  function handleClick() {
    if (product.sizes.length > 0) {
      // Products with sizes are added via ProductPurchasePanel, where a
      // size can actually be selected — this quick-add button only
      // handles sizeless items (watches, perfumes) safely.
      alert("Please select options on the product page.");
      return;
    }
    addItem(product, 1, null);
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
