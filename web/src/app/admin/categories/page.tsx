"use client";

import { useEffect, useState, FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { apiFetch, apiAuthPost, apiAuthDelete } from "@/lib/api";
import { Category } from "@/types/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FullPageSpinner } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/admin /confirm-dialog";

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
  const [confirmTarget, setConfirmTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  function load() {
    apiFetch<Category[]>("/categories").then(setCategories);
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

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Categories</h1>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6 max-w-md">
        <Input
          required
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-10"
        />
        <Button type="submit" disabled={saving} className="h-10 shrink-0">
          {saving ? "Adding..." : "Add"}
        </Button>
      </form>
      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      <div className="border rounded-xl divide-y bg-background">
        {categories.map((c) => (
          <div
            key={c.id}
            className="p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{c.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                /{c.slug}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfirmTarget({ id: c.id, name: c.name })}
              className="text-destructive hover:text-destructive shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
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
