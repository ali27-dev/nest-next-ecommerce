"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/api";

interface ProductGridProps {
  initialProducts: Product[];
  initialPage: number;
  totalPages: number;
  queryString: string; // current filters, without the "page" param
}

export function ProductGrid({
  initialProducts,
  initialPage,
  totalPages,
  queryString,
}: ProductGridProps) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);

  const hasMore = page < totalPages;

  async function handleShowMore() {
    setLoading(true);
    const nextPage = page + 1;
    const res = await fetch(
      `${API_URL}/products?${queryString}&page=${nextPage}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    setProducts((prev) => [...prev, ...data.products]);
    setPage(nextPage);
    setLoading(false);
  }

  if (products.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-16">
        No products match these filters.
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleShowMore}
            disabled={loading}
            variant="outline"
            className="h-11 px-8"
          >
            {loading ? "Loading..." : "Show More"}
          </Button>
        </div>
      )}
    </div>
  );
}
