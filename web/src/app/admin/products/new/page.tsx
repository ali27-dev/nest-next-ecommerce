"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Category, Fabric } from "@/types/product";
import { FullPageSpinner } from "@/components/ui/spinner";
import { ProductForm } from "@/components/cart/product-form";

export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [fabrics, setFabrics] = useState<Fabric[] | null>(null);

  useEffect(() => {
    apiFetch<Category[]>("/categories").then(setCategories);
    apiFetch<Fabric[]>("/fabrics").then(setFabrics);
  }, []);

  if (!categories || !fabrics) return <FullPageSpinner />;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Add Product</h1>
      <ProductForm categories={categories} fabrics={fabrics} />
    </div>
  );
}
