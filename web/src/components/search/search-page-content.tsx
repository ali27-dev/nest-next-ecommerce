"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Product, ProductListResponse, Fabric } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";

import { SearchFilterBar } from "./search-filter-bar";
import { Pagination } from "./paginnation";

export function SearchPageContent({
  query,
  initialResult,
  fabrics,
  activeParams,
}: {
  query: string;
  initialResult: ProductListResponse;
  fabrics: Fabric[];
  activeParams: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(query);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (inputValue.trim()) params.set("q", inputValue.trim());
    router.push(`/search?${params.toString()}`);
  }

  const hasCriteria = Boolean(
    query ||
      activeParams.season ||
      activeParams.pieceCount ||
      activeParams.fabricId ||
      activeParams.onSale
  );

  return (
    <div className="px-6 md:px-10 py-8">
      <h1 className="text-2xl font-semibold mb-1">Search Results</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Find products by name, SKU, or ID, or refine using the filters below.
      </p>

      <form onSubmit={handleSearchSubmit} className="max-w-xl mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by name, SKU, or ID..."
            className="h-12 pl-11"
          />
        </div>
      </form>

      <SearchFilterBar fabrics={fabrics} total={initialResult.meta.total} />

      {!hasCriteria ? (
        <p className="text-sm text-muted-foreground py-16 text-center">
          Enter a search term or choose a filter above to find products.
        </p>
      ) : initialResult.products.length === 0 ? (
        <p className="text-sm text-muted-foreground py-16 text-center">
          No products match{query ? ` "${query}"` : " these filters"}. Try
          adjusting your search.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            {initialResult.products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            currentPage={initialResult.meta.page}
            totalPages={initialResult.meta.totalPages}
            query={query}
          />
        </>
      )}
    </div>
  );
}
