"use client";

import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types/product";
import { pieceCountLabel } from "@/lib/product-labels";
import { AddToCartButton } from "./add-to-cart-button";

export function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const showSecondary = hovered && product.secondaryImageUrl;
  const piece = pieceCountLabel(product.pieceCount);
  const hasDiscount =
    product.compareAtPrice &&
    Number(product.compareAtPrice) > Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(
        (1 - Number(product.price) / Number(product.compareAtPrice)) * 100
      )
    : null;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/products/${product.id}`}
        className="block relative aspect-[3/4] bg-muted overflow-hidden rounded-lg"
      >
        {product.imageUrl && (
          <img
            src={showSecondary ? product.secondaryImageUrl! : product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-opacity duration-200"
          />
        )}

        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
            {discountPercent}% OFF
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 bg-muted-foreground text-background text-xs font-medium px-2 py-1 rounded">
            Sold out
          </span>
        )}
      </Link>

      <div className="absolute bottom-3 right-3">
        <AddToCartButton
          productId={product.id}
          disabled={product.stock === 0}
          variant="icon"
        />
      </div>

      <div className="pt-3">
        <Link href={`/products/${product.id}`}>
          <p className="text-sm font-medium truncate">{product.name}</p>
        </Link>
        {piece && <p className="text-xs text-muted-foreground">{piece}</p>}

        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm font-mono font-medium">
            Rs {Number(product.price).toLocaleString()}
          </p>
          {hasDiscount && (
            <p className="text-xs font-mono text-muted-foreground line-through">
              Rs {Number(product.compareAtPrice).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
