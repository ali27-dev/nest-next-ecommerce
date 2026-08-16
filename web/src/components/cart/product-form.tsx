"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiAuthPost, apiAuthPatch } from "@/lib/api";
import { Category, Fabric, Product } from "@/types/product";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  fabrics: Fabric[];
}

const seasons = ["SUMMER", "WINTER", "ALL_SEASON"];
const pieceCounts = ["ONE_PIECE", "TWO_PIECE", "THREE_PIECE"];
const stitchTypes = ["STITCHED", "UNSTITCHED"];

export function ProductForm({
  product,
  categories,
  fabrics,
}: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compareAtPrice ?? ""
  );
  const [stock, setStock] = useState(String(product?.stock ?? 0));
  const [sku, setSku] = useState(product?.sku ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [fabricId, setFabricId] = useState(product?.fabricId ?? "");
  const [season, setSeason] = useState(product?.season ?? "");
  const [pieceCount, setPieceCount] = useState(product?.pieceCount ?? "");
  const [stitchType, setStitchType] = useState(product?.stitchType ?? "");
  const [color, setColor] = useState(product?.color ?? "");
  const [sizes, setSizes] = useState((product?.sizes ?? []).join(", "));
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function buildPayload() {
    return {
      name,
      description: description || undefined,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      stock: Number(stock),
      sku,
      categoryId,
      fabricId: fabricId || undefined,
      season: season || undefined,
      pieceCount: pieceCount || undefined,
      stitchType: stitchType || undefined,
      color: color || undefined,
      sizes: sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      isActive,
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isEdit && product) {
        await apiAuthPatch(`/products/${product.id}`, buildPayload());
        router.refresh();
      } else {
        const created = await apiAuthPost<Product>("/products", buildPayload());
        router.push(`/admin/products/${created.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5 h-11"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1.5"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Price (Rs)</label>
          <Input
            required
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1.5 h-11"
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            Compare-at price (optional)
          </label>
          <Input
            type="number"
            step="0.01"
            value={compareAtPrice}
            onChange={(e) => setCompareAtPrice(e.target.value)}
            className="mt-1.5 h-11"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Stock</label>
          <Input
            required
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-1.5 h-11"
          />
        </div>
        <div>
          <label className="text-sm font-medium">SKU</label>
          <Input
            required
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="mt-1.5 h-11"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Category</label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1.5 w-full h-11 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Fabric (optional)</label>
          <select
            value={fabricId}
            onChange={(e) => setFabricId(e.target.value)}
            className="mt-1.5 w-full h-11 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">None</option>
            {fabrics.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Season (optional)</label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="mt-1.5 w-full h-11 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">None</option>
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Pieces (optional)</label>
          <select
            value={pieceCount}
            onChange={(e) => setPieceCount(e.target.value)}
            className="mt-1.5 w-full h-11 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">None</option>
            {pieceCounts.map((p) => (
              <option key={p} value={p}>
                {p.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Stitch type (optional)</label>
          <select
            value={stitchType}
            onChange={(e) => setStitchType(e.target.value)}
            className="mt-1.5 w-full h-11 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">None</option>
            {stitchTypes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Color (optional)</label>
          <Input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="mt-1.5 h-11"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">
          Sizes (comma-separated, optional)
        </label>
        <Input
          value={sizes}
          onChange={(e) => setSizes(e.target.value)}
          placeholder="S, M, L, XL"
          className="mt-1.5 h-11"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Active (visible on the storefront)
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={saving} className="h-12 w-fit px-8">
        {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
      </Button>
    </form>
  );
}
