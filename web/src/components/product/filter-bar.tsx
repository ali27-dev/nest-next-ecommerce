"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Fabric } from "@/types/product";
import { Input } from "@/components/ui/input";

const seasons = ["SUMMER", "WINTER", "ALL_SEASON"] as const;
const pieceCounts = ["ONE_PIECE", "TWO_PIECE", "THREE_PIECE"] as const;

export function FilterBar({ fabrics }: { fabrics: Fabric[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // reset pagination whenever a filter changes
    router.push(`${pathname}?${params.toString()}`);
  }

  function isChecked(key: string, value: string) {
    return searchParams.get(key) === value;
  }

  return (
    <aside className="w-56 shrink-0 flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Season</h3>
        <div className="flex flex-col gap-2">
          {seasons.map((season) => (
            <label key={season} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isChecked("season", season)}
                onChange={() =>
                  updateParam(
                    "season",
                    isChecked("season", season) ? null : season
                  )
                }
              />
              {season.replace("_", " ")}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Fabric</h3>
        <div className="flex flex-col gap-2">
          {fabrics.map((fabric) => (
            <label key={fabric.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isChecked("fabricId", fabric.id)}
                onChange={() =>
                  updateParam(
                    "fabricId",
                    isChecked("fabricId", fabric.id) ? null : fabric.id
                  )
                }
              />
              {fabric.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Pieces</h3>
        <div className="flex flex-col gap-2">
          {pieceCounts.map((pc) => (
            <label key={pc} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isChecked("pieceCount", pc)}
                onChange={() =>
                  updateParam(
                    "pieceCount",
                    isChecked("pieceCount", pc) ? null : pc
                  )
                }
              />
              {pc.replace("_", " ")}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Price</h3>
        <div className="flex flex-col gap-2">
          <Input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get("minPrice") ?? ""}
            onBlur={(e) => updateParam("minPrice", e.target.value || null)}
            className="h-9"
          />
          <Input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get("maxPrice") ?? ""}
            onBlur={(e) => updateParam("maxPrice", e.target.value || null)}
            className="h-9"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Sort</h3>
        <select
          value={searchParams.get("sort") ?? "newest"}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="w-full h-9 rounded-md border bg-background px-2 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </aside>
  );
}
