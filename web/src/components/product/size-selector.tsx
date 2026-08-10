"use client";

import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: string[];
  selected: string | null;
  onSelect: (size: string) => void;
}

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  if (sizes.length === 0) return null;

  return (
    <div>
      <p className="text-sm font-medium mb-2">Size</p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={cn(
              "h-10 min-w-10 px-3 rounded-md border text-sm font-medium transition-colors",
              selected === size
                ? "bg-foreground text-background border-foreground"
                : "hover:bg-accent"
            )}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
