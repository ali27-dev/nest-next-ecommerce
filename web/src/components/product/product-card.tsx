import Link from "next/link";
import { Product } from "@/types/product";
import { AddToCartButton } from "./add-to-cart-button";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative">
      <Link
        href={`/products/${product.id}`}
        className="block relative aspect-[3/4] bg-muted overflow-hidden rounded-lg"
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}

        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
            Low stock
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 bg-muted-foreground text-background text-xs font-medium px-2 py-1 rounded">
            Sold out
          </span>
        )}
      </Link>

      {/* Floating add-to-cart button, overlaid bottom-right on the image, like the reference */}
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
        <p className="text-sm font-mono font-medium mt-1">
          Rs {Number(product.price).toLocaleString()}
        </p>
        {/* Coming soon: strikethrough original price + discount badge —
            requires adding a compareAtPrice field to the Product schema,
            which doesn't exist yet. */}
      </div>
    </div>
  );
}
