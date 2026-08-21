"use client";

import { useCart } from "@/contexts/cart-context";
import { Input } from "@/components/ui/input";

export function OrderSummaryPanel() {
  const { lines, subtotal, totalItems } = useCart();

  return (
    <div className="border rounded-xl p-5 h-fit">
      <div className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-1">
        {lines.map((line) => (
          <div
            key={`${line.product.id}-${line.size ?? "none"}`}
            className="flex gap-3"
          >
            <div className="relative h-16 w-14 rounded-md overflow-hidden bg-muted shrink-0">
              {line.product.imageUrl && (
                <img
                  src={line.product.imageUrl}
                  alt={line.product.name}
                  className="h-full w-full object-cover"
                />
              )}
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-foreground text-background text-[10px] font-medium flex items-center justify-center">
                {line.quantity}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm">{line.product.name}</p>
              {line.size && (
                <p className="text-xs text-muted-foreground">{line.size}</p>
              )}
            </div>
            <p className="text-sm font-mono">
              Rs {(Number(line.product.price) * line.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-5">
        <Input placeholder="Discount code" className="h-10" disabled />
        <button
          type="button"
          disabled
          className="h-10 px-4 rounded-md border text-sm text-muted-foreground"
        >
          Apply
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Discount codes — coming soon.
      </p>

      <div className="border-t mt-4 pt-4 flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({totalItems} items)
          </span>
          <span className="font-mono">Rs {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-muted-foreground">Free</span>
        </div>
        <div className="flex justify-between text-base font-semibold border-t pt-3 mt-1">
          <span>Total</span>
          <span className="font-mono">Rs {subtotal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
