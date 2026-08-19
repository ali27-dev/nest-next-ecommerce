"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Fabric } from "@/types/product";

const seasons = [
  { value: "SUMMER", label: "Summer" },
  { value: "WINTER", label: "Winter" },
  { value: "ALL_SEASON", label: "All Season" },
];

const pieceCounts = [
  { value: "ONE_PIECE", label: "1 Piece" },
  { value: "TWO_PIECE", label: "2 Piece" },
  { value: "THREE_PIECE", label: "3 Piece" },
];

export function SearchFilterBar({
  fabrics,
  total,
}: {
  fabrics: Fabric[];
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center gap-3 py-4 border-y mb-6">
      <span className="flex items-center gap-1.5 text-sm font-medium shrink-0">
        <SlidersHorizontal className="h-4 w-4" /> Filter:
      </span>

      <Select
        value={searchParams.get("season") ?? ""}
        onValueChange={(v) => updateParam("season", v || null)}
      >
        <SelectTrigger className="w-32 h-9">
          <SelectValue placeholder="Season" />
        </SelectTrigger>
        <SelectContent>
          {seasons.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("fabricId") ?? ""}
        onValueChange={(v) => updateParam("fabricId", v || null)}
      >
        <SelectTrigger className="w-32 h-9">
          <SelectValue placeholder="Fabric" />
        </SelectTrigger>
        <SelectContent>
          {fabrics.map((f) => (
            <SelectItem key={f.id} value={f.id}>
              {f.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("pieceCount") ?? ""}
        onValueChange={(v) => updateParam("pieceCount", v || null)}
      >
        <SelectTrigger className="w-32 h-9">
          <SelectValue placeholder="Piece" />
        </SelectTrigger>
        <SelectContent>
          {pieceCounts.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        onClick={() =>
          updateParam("onSale", searchParams.get("onSale") ? null : "1")
        }
        className={`h-9 px-3 rounded-md border text-sm font-medium transition-colors ${
          searchParams.get("onSale")
            ? "bg-foreground text-background border-foreground"
            : "hover:bg-accent"
        }`}
      >
        On Sale
      </button>

      <span className="text-sm text-muted-foreground ml-auto">
        {total} results
      </span>
    </div>
  );
}
