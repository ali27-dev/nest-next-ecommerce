"use client";

import { useEffect, useState } from "react";
import { Trash2, GripVertical } from "lucide-react";
import {
  apiAuthGet,
  apiAuthPatch,
  apiAuthDelete,
  apiAuthUpload,
  apiFetch,
} from "@/lib/api";
import { Banner } from "@/types/banner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FullPageSpinner } from "@/components/ui/spinner";
import { AdminBackButton } from "@/components/admin /admin-back-button";
import { ConfirmDialog } from "@/components/admin /confirm-dialog";
import { Category } from "@/types/product";

export default function AdminBannersPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function load() {
    apiAuthGet<Banner[]>("/banners/admin/all").then(setBanners);
  }

  useEffect(load, []);

  useEffect(() => {
    apiFetch<Category[]>("/categories").then(setCategories);
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      await apiAuthUpload("/banners/upload", formData, "POST");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function updateField(
    id: string,
    field: "title" | "linkUrl" | "order",
    value: string
  ) {
    await apiAuthPatch(`/banners/${id}`, {
      [field]: field === "order" ? Number(value) : value,
    });
    load();
  }

  async function toggleActive(id: string, isActive: boolean) {
    await apiAuthPatch(`/banners/${id}`, { isActive: !isActive });
    load();
  }

  async function confirmDelete() {
    if (!confirmTarget) return;
    setDeletingId(confirmTarget.id);
    try {
      await apiAuthDelete(`/banners/${confirmTarget.id}`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete banner");
    } finally {
      setDeletingId(null);
      setConfirmTarget(null);
    }
  }

  async function updateCategory(bannerId: string, categoryId: string) {
    await apiAuthPatch(`/banners/${bannerId}`, {
      categoryId: categoryId || null,
    });
    load();
  }

  if (!banners) return <FullPageSpinner />;

  return (
    <div>
      <AdminBackButton />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Home Banners</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage the hero carousel shown at the top of the home page. Lower
            order numbers appear first.
          </p>
        </div>
        <Button asChild disabled={uploading}>
          <label className="cursor-pointer">
            {uploading ? "Uploading..." : "Add Banner"}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </Button>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {banners.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No banners yet — the home page hero will be empty until you add one.
        </p>
      ) : (
        <div className="border rounded-xl divide-y bg-background">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="flex flex-wrap sm:flex-nowrap items-center gap-4 p-4"
            >
              <div className="h-16 w-28 rounded-md overflow-hidden bg-muted shrink-0">
                <img
                  src={banner.imageUrl}
                  alt={banner.title ?? ""}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-[200px] grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  placeholder="Title (optional)"
                  defaultValue={banner.title ?? ""}
                  onBlur={(e) =>
                    updateField(banner.id, "title", e.target.value)
                  }
                  className="h-9"
                />
                <Input
                  placeholder="Link URL (e.g. /category/women-id)"
                  defaultValue={banner.linkUrl ?? ""}
                  onBlur={(e) =>
                    updateField(banner.id, "linkUrl", e.target.value)
                  }
                  className="h-9"
                />
                <div className="flex items-center gap-1.5">
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    type="number"
                    placeholder="Order"
                    defaultValue={banner.order}
                    onBlur={(e) =>
                      updateField(banner.id, "order", e.target.value)
                    }
                    className="h-9 w-20"
                  />
                </div>
              </div>

              <select
                defaultValue={banner.categoryId ?? ""}
                onChange={(e) => updateCategory(banner.id, e.target.value)}
                className="h-9 rounded-md border bg-background px-2 text-sm"
              >
                <option value="">General (no category)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => toggleActive(banner.id, banner.isActive)}
                className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                  banner.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {banner.isActive ? "Active" : "Hidden"}
              </button>

              <Button
                size="sm"
                variant="outline"
                disabled={deletingId === banner.id}
                onClick={() =>
                  setConfirmTarget({
                    id: banner.id,
                    title: banner.title ?? "this banner",
                  })
                }
                className="text-destructive hover:text-destructive shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        title="Delete banner?"
        description={`"${confirmTarget?.title}" will be permanently removed from the home page carousel.`}
        loading={deletingId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
