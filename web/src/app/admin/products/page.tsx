"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { apiFetch, apiAuthDelete } from "@/lib/api";
import { Product, ProductListResponse } from "@/types/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FullPageSpinner } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/admin /confirm-dialog";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  function load() {
    apiFetch<ProductListResponse>("/products?limit=100").then((r) =>
      setProducts(r.products)
    );
  }

  useEffect(load, []);

  async function confirmDelete() {
    if (!confirmTarget) return;
    setDeletingId(confirmTarget.id);
    setError(null);
    try {
      await apiAuthDelete(`/products/${confirmTarget.id}`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setDeletingId(null);
      setConfirmTarget(null);
    }
  }

  if (!products) return <FullPageSpinner />;

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-xl font-semibold">Products</h1>
        <Button asChild className="h-10 gap-2">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      <Input
        placeholder="Search by name, SKU, or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-10 max-w-sm mb-6"
      />

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      <div className="border rounded-xl divide-y bg-background">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 p-4"
          >
            <div className="h-14 w-12 rounded-md overflow-hidden bg-muted shrink-0">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="min-w-0 flex-1 basis-full sm:basis-auto">
              <p className="text-sm font-medium truncate flex items-center gap-2">
                {product.name}
                {!product.isActive && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                    Inactive
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {product.category?.name ?? "—"} · SKU {product.sku}
              </p>
            </div>

            <p className="text-sm font-mono w-20 shrink-0">
              Rs {Number(product.price).toLocaleString()}
            </p>

            <span
              className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
                product.stock > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>

            <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/products/${product.id}`}>Edit</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setConfirmTarget({ id: product.id, name: product.name })
                }
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="p-6 text-sm text-muted-foreground text-center">
            No products found.
          </p>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        title="Delete product?"
        description={`"${confirmTarget?.name}" will be permanently deleted, or deactivated if it has order history.`}
        loading={deletingId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
