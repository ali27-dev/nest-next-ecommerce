"use client";

import { cn } from "@/lib/utils";

interface FaqAccordionProps {
  items: { question: string; answer: string }[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <details
          key={item.question}
          className="group rounded-2xl border bg-background shadow-sm overflow-hidden"
          open={i === 0}
        >
          <summary
            className={cn(
              "flex cursor-pointer list-none items-center justify-between gap-4",
              "px-4 py-4 md:px-5 md:py-5 text-sm md:text-base font-medium",
              "hover:bg-muted/40 transition-colors",
              "[&::-webkit-details-marker]:hidden"
            )}
          >
            <span className="text-left">{item.question}</span>
            <span className="shrink-0 text-muted-foreground text-lg leading-none group-open:rotate-45 transition-transform">
              +
            </span>
          </summary>
          <div className="px-4 pb-4 md:px-5 md:pb-5 text-sm md:text-[15px] text-muted-foreground leading-relaxed border-t bg-muted/20 pt-4">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
