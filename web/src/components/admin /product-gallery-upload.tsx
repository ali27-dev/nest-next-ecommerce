"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { apiAuthUpload, apiAuthPatch } from "@/lib/api";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";

export function ProductGalleryUpload({
  product,
  onUploaded,
}: {
  product: Product;
  onUploaded: (p: Product) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("images", file));
      const updated = await apiAuthUpload<Product>(
        `/products/${product.id}/gallery`,
        formData
      );
      onUploaded(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleRemove(index: number) {
    setRemovingIndex(index);
    setError(null);
    try {
      const nextGallery = product.galleryImages.filter((_, i) => i !== index);
      const updated = await apiAuthPatch<Product>(`/products/${product.id}`, {
        galleryImages: nextGallery,
      });
      onUploaded(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove image");
    } finally {
      setRemovingIndex(null);
    }
  }

  return (
    <div>
      <label className="text-sm font-medium">Gallery Images</label>
      <p className="text-xs text-muted-foreground mt-1 mb-3">
        Additional photos shown on the product detail page. Uploading adds to
        the existing gallery rather than replacing it.
      </p>

      <div className="flex flex-wrap gap-3 mb-3">
        {product.galleryImages.map((url, i) => (
          <div
            key={url + i}
            className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted group"
          >
            <img
              src={url}
              alt={`Gallery ${i + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              disabled={removingIndex === i}
              aria-label="Remove image"
              className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" disabled={uploading} asChild>
        <label className="cursor-pointer">
          {uploading ? "Uploading..." : "Add Images"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="hidden"
          />
        </label>
      </Button>
      {error && <p className="text-sm text-destructive mt-1.5">{error}</p>}
    </div>
  );
}
