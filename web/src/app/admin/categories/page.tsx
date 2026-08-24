"use client";

import { useEffect, useState, FormEvent } from "react";
import { Trash2, Upload, Home, Eye, EyeOff } from "lucide-react";
import {
  apiAuthGet,
  apiAuthPost,
  apiAuthPatch,
  apiAuthDelete,
  apiAuthUpload,
} from "@/lib/api";
import { Category } from "@/types/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FullPageSpinner } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/admin /confirm-dialog";
import { AdminBackButton } from "@/components/admin /admin-back-button";
import { cn } from "@/lib/utils";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  function load() {
    apiAuthGet<Category[]>("/categories/admin/all").then(setCategories);
  }

  useEffect(load, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await apiAuthPost("/categories", { name, slug: slugify(name) });
      setName("");
      load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create category"
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateField(
    id: string,
    field: keyof Pick<Category, "name" | "tagline" | "homeOrder" | "showOnHome">,
    value: string | number | boolean
  ) {
    setError(null);
    try {
      await apiAuthPatch(`/categories/${id}`, { [field]: value });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function handleImageUpload(
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingId(id);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      await apiAuthUpload(`/categories/${id}/upload-image`, formData, "POST");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingId(null);
      e.target.value = "";
    }
  }

  async function confirmDelete() {
    if (!confirmTarget) return;
    setDeletingId(confirmTarget.id);
    setError(null);
    try {
      await apiAuthDelete(`/categories/${confirmTarget.id}`);
      load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete category"
      );
    } finally {
      setDeletingId(null);
      setConfirmTarget(null);
    }
  }

  if (!categories) return <FullPageSpinner />;

  const homeCategories = categories.filter((c) => c.showOnHome);

  return (
    <div className="space-y-8">
      <AdminBackButton />

      <div className="rounded-xl border bg-muted/30 p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background border">
            <Home className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Home page — Shop by Category</h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
              Toggle categories on, upload a cover image, set display order, and
              add a short tagline. Only categories marked for home appear in the
              storefront showcase.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {homeCategories.length} categor{homeCategories.length === 1 ? "y" : "ies"} visible on home
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-2 max-w-lg">
        <Input
          required
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11"
        />
        <Button type="submit" disabled={saving} className="h-11 shrink-0">
          {saving ? "Adding..." : "Add Category"}
        </Button>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-4">
        {categories.map((category) => (
          <article
            key={category.id}
            className={cn(
              "rounded-xl border bg-background overflow-hidden",
              category.showOnHome && "ring-1 ring-primary/20"
            )}
          >
            <div className="flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-36 md:w-44 aspect-[4/3] sm:aspect-auto sm:min-h-[140px] bg-muted shrink-0">
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground px-3 text-center">
                    No image yet
                  </div>
                )}
                <label className="absolute bottom-2 right-2 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={uploadingId === category.id}
                    onChange={(e) => handleImageUpload(category.id, e)}
                  />
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/90 border shadow-sm hover:bg-background">
                    <Upload className="h-3.5 w-3.5" />
                  </span>
                </label>
              </div>

              <div className="flex-1 p-4 space-y-3 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{category.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      /{category.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      variant={category.showOnHome ? "default" : "outline"}
                      className="h-8 text-xs gap-1.5"
                      onClick={() =>
                        updateField(category.id, "showOnHome", !category.showOnHome)
                      }
                    >
                      {category.showOnHome ? (
                        <>
                          <Eye className="h-3.5 w-3.5" />
                          On Home
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3.5 w-3.5" />
                          Hidden
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setConfirmTarget({ id: category.id, name: category.name })
                      }
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Tagline
                    </label>
                    <Input
                      defaultValue={category.tagline ?? ""}
                      placeholder="e.g. New arrivals for her"
                      className="h-9 mt-1 text-sm"
                      onBlur={(e) => {
                        const value = e.target.value.trim();
                        if (value !== (category.tagline ?? "")) {
                          updateField(category.id, "tagline", value);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Home order
                    </label>
                    <Input
                      type="number"
                      min={0}
                      defaultValue={category.homeOrder ?? 0}
                      className="h-9 mt-1 text-sm"
                      onBlur={(e) => {
                        const value = Number(e.target.value);
                        if (!Number.isNaN(value) && value !== category.homeOrder) {
                          updateField(category.id, "homeOrder", value);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        title="Delete category?"
        description={`Products in "${confirmTarget?.name}" will keep their reference but this category will no longer be selectable.`}
        loading={deletingId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
