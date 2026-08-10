"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterDrawer } from "./filter-drawer";
import { Fabric } from "@/types/product";

export function FilterSortBar({
  fabrics,
  total,
}: {
  fabrics: Fabric[];
  total: number;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div
      className="flex items-center justify-between px-6 md:px-10 py-4 border-b"
      id="products"
    >
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="h-10 gap-2"
          onClick={() => setDrawerOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter
        </Button>
        <span className="text-sm text-muted-foreground hidden sm:inline">
          {total} Products
        </span>
      </div>

      <Select
        defaultValue={searchParams.get("sort") ?? "newest"}
        onValueChange={handleSortChange}
      >
        <SelectTrigger className="w-48 h-10">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Date, New to Old</SelectItem>
          <SelectItem value="price_asc">Price: Low to High</SelectItem>
          <SelectItem value="price_desc">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        fabrics={fabrics}
      />
    </div>
  );
}
