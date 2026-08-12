"use client";

import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types/product";
import { AddToCartButton } from "./add-to-cart-button";

export function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const showSecondary = hovered && Boolean(product.secondaryImageUrl);
  const hasDiscount =
    product.compareAtPrice &&
    Number(product.compareAtPrice) > Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(
        (1 - Number(product.price) / Number(product.compareAtPrice)) * 100
      )
    : null;

  return (
    <article
      className="group relative w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products/${product.id}`} className="block">
        <figure className="relative aspect-[3/4] bg-muted overflow-hidden rounded-xl m-0">
          {product.imageUrl && (
            <>
              <img
                src={product.imageUrl}
                alt={product.name}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                  showSecondary ? "opacity-0" : "opacity-100"
                }`}
              />
              {product.secondaryImageUrl && (
                <img
                  src={product.secondaryImageUrl}
                  alt={`${product.name} alternate view`}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                    showSecondary ? "opacity-100" : "opacity-0"
                  }`}
                />
              )}
            </>
          )}

          {hasDiscount && (
            <span
              className="absolute top-3 left-3 text-[11px] font-bold tracking-wide px-2.5 py-1 rounded"
              style={{ backgroundColor: "#d31919", color: "#fefcfc" }}
            >
              {discountPercent}% OFF
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-3 left-3 bg-neutral-800 text-white text-[11px] font-bold tracking-wide px-2.5 py-1 rounded">
              SOLD OUT
            </span>
          )}

          {product.secondaryImageUrl && (
            <span
              className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5"
              aria-hidden="true"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  showSecondary ? "bg-white/50" : "bg-white"
                }`}
              />
              <span
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  showSecondary ? "bg-white" : "bg-white/50"
                }`}
              />
            </span>
          )}
        </figure>
      </Link>

      <div className="absolute bottom-[4.5rem] right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <AddToCartButton
          product={product}
          disabled={product.stock === 0}
          variant="icon"
        />
      </div>

      <div className="pt-3">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-normal leading-snug truncate">
            {product.name}
          </h3>
        </Link>

        <p className="flex items-center gap-2 mt-1">
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              Rs. {Number(product.compareAtPrice).toLocaleString()}
            </span>
          )}
          <span className="text-sm font-semibold">
            Rs. {Number(product.price).toLocaleString()}
          </span>
        </p>
      </div>
    </article>
  );
}
