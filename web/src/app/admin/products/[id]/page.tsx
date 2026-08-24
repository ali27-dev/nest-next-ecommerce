"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiAuthGet, apiFetch } from "@/lib/api";
import { Category, Fabric, Product } from "@/types/product";

import { FullPageSpinner } from "@/components/ui/spinner";
import { ProductForm } from "@/components/cart/product-form";
import { ProductGalleryUpload } from "@/components/admin /product-gallery-upload";
import { ProductImageUpload } from "@/components/admin /product-image-upload";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [fabrics, setFabrics] = useState<Fabric[] | null>(null);

  useEffect(() => {
    apiAuthGet<Product>(`/products/admin/${params.id}`).then(setProduct);
    apiFetch<Category[]>("/categories").then(setCategories);
    apiFetch<Fabric[]>("/fabrics").then(setFabrics);
  }, [params.id]);

  if (!product || !categories || !fabrics) return <FullPageSpinner />;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Edit Product</h1>

      <div className="max-w-2xl mb-8">
        <ProductImageUpload product={product} onUploaded={setProduct} />
      </div>

      <div className="max-w-2xl mb-8">
        <ProductGalleryUpload product={product} onUploaded={setProduct} />
      </div>

      <ProductForm
        product={product}
        categories={categories}
        fabrics={fabrics}
      />
    </div>
  );
}
