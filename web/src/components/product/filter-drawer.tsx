"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Fabric } from "@/types/product";
import { Flash } from "@hugeicons/core-free-icons";

type View = "root" | "season" | "fabric" | "price";

const seasonOptions = [
  { value: "SUMMER", label: "Summer" },
  { value: "WINTER", label: "Winter" },
  { value: "ALL_SEASON", label: "All Season" },
];

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  fabrics: Fabric[];
}

export function FilterDrawer({ open, onClose, fabrics }: FilterDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [view, setView] = useState<View>("root");
  const [season, setSeason] = useState<string | null>(null);
  const [fabricIds, setFabricIds] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Sync staged state from the URL every time the drawer opens
  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setView("root");
    setSeason(searchParams.get("season"));
    setFabricIds(
      searchParams.get("fabricId")?.split(",").filter(Boolean) ?? []
    );
    setMinPrice(searchParams.get("minPrice") ?? "");
    setMaxPrice(searchParams.get("maxPrice") ?? "");
  }, [open, searchParams]);

  function toggleFabric(id: string) {
    setFabricIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  function clearSection() {
    if (view === "season") setSeason(null);
    if (view === "fabric") setFabricIds([]);
    if (view === "price") {
      setMinPrice("");
      setMaxPrice("");
    }
    if (view === "root") {
      setSeason(null);
      setFabricIds([]);
      setMinPrice("");
      setMaxPrice("");
    }
  }

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    season ? params.set("season", season) : params.delete("season");
    fabricIds.length
      ? params.set("fabricId", fabricIds.join(","))
      : params.delete("fabricId");
    minPrice ? params.set("minPrice", minPrice) : params.delete("minPrice");
    maxPrice ? params.set("maxPrice", maxPrice) : params.delete("maxPrice");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    onClose();
  }

  const sectionTitle =
    view === "season"
      ? "Season"
      : view === "fabric"
      ? "Fabric"
      : view === "price"
      ? "Price"
      : "Filter";

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-200",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full sm:w-96 flex flex-col bg-background border-l shadow-xl transition-transform duration-200 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 h-14 px-5 border-b shrink-0">
          {view !== "root" && (
            <button
              onClick={() => setView("root")}
              aria-label="Back"
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <span className="font-semibold text-lg flex-1">{sectionTitle}</span>
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {view === "root" && (
            <div className="flex flex-col">
              <button
                onClick={() => setView("season")}
                className="flex items-center justify-between px-5 py-4 border-b text-sm font-medium hover:bg-accent"
              >
                Season{" "}
                {season && (
                  <span className="text-muted-foreground font-normal ml-2">
                    ({season.replace("_", " ")})
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => setView("price")}
                className="flex items-center justify-between px-5 py-4 border-b text-sm font-medium hover:bg-accent"
              >
                Price{" "}
                {(minPrice || maxPrice) && (
                  <span className="text-muted-foreground font-normal ml-2">
                    ({minPrice || 0}–{maxPrice || "∞"})
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => setView("fabric")}
                className="flex items-center justify-between px-5 py-4 border-b text-sm font-medium hover:bg-accent"
              >
                Fabric{" "}
                {fabricIds.length > 0 && (
                  <span className="text-muted-foreground font-normal ml-2">
                    ({fabricIds.length})
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          )}

          {view === "season" && (
            <div className="flex flex-col p-5 gap-4">
              {seasonOptions.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 text-sm"
                >
                  <Checkbox
                    checked={season === opt.value}
                    onCheckedChange={() =>
                      setSeason(season === opt.value ? null : opt.value)
                    }
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          )}

          {view === "fabric" && (
            <div className="flex flex-col p-5 gap-4">
              {fabrics.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No fabrics available yet.
                </p>
              )}
              {fabrics.map((fabric) => (
                <label
                  key={fabric.id}
                  className="flex items-center gap-3 text-sm"
                >
                  <Checkbox
                    checked={fabricIds.includes(fabric.id)}
                    onCheckedChange={() => toggleFabric(fabric.id)}
                  />
                  {fabric.name}
                  {/* Coming soon: live per-fabric product counts, e.g. "Lawn (399)" */}
                </label>
              ))}
            </div>
          )}

          {view === "price" && (
            <div className="flex flex-col p-5 gap-3">
              <label className="text-sm font-medium">
                Min price
                <Input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="mt-1.5 h-10"
                  placeholder="Rs 0"
                />
              </label>
              <label className="text-sm font-medium">
                Max price
                <Input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="mt-1.5 h-10"
                  placeholder="No limit"
                />
              </label>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 p-5 border-t shrink-0">
          <Button
            variant="outline"
            className="flex-1 h-11"
            onClick={clearSection}
          >
            {view === "root" ? "Remove all" : "Clear"}
          </Button>
          <Button className="flex-1 h-11" onClick={applyFilters}>
            Apply
          </Button>
        </div>
      </aside>
    </>
  );
}

export { SlidersHorizontal as FilterIcon };
