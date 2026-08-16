"use client";

import { useState } from "react";
import { apiAuthUpload } from "@/lib/api";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";

interface SlotProps {
  label: string;
  imageUrl: string | null;
  endpoint: string;
  productName: string;
  onUploaded: (updated: Product) => void;
}

function ImageSlot({
  label,
  imageUrl,
  endpoint,
  productName,
  onUploaded,
}: SlotProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const updated = await apiAuthUpload<Product>(endpoint, formData);
      onUploaded(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="mt-1.5 flex items-center gap-4">
        <div className="h-24 w-20 rounded-lg bg-muted overflow-hidden shrink-0">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={productName}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div>
          <Button type="button" variant="outline" disabled={uploading} asChild>
            <label className="cursor-pointer">
              {uploading ? "Uploading..." : imageUrl ? "Replace" : "Upload"}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </Button>
          {error && <p className="text-sm text-destructive mt-1.5">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export function ProductImageUpload({
  product,
  onUploaded,
}: {
  product: Product;
  onUploaded: (p: Product) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <ImageSlot
        label="Primary Image"
        imageUrl={product.imageUrl}
        endpoint={`/products/${product.id}/image`}
        productName={product.name}
        onUploaded={onUploaded}
      />
      <ImageSlot
        label="Secondary Image (shown on hover)"
        imageUrl={product.secondaryImageUrl}
        endpoint={`/products/${product.id}/secondary-image`}
        productName={product.name}
        onUploaded={onUploaded}
      />
    </div>
  );
}
