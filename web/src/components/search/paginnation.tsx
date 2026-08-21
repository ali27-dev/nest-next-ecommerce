"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function buildHref(searchParams: URLSearchParams, page: number) {
  const params = new URLSearchParams(searchParams.toString());
  params.set("page", String(page));
  return `/search?${params.toString()}`;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
  query: string;
}) {
  const searchParams = useSearchParams();
  if (totalPages <= 1) return null;
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Search results pages"
      className="flex items-center justify-center gap-1.5"
    >
      <Link
        href={buildHref(searchParams, Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={cn(
          "h-9 w-9 flex items-center justify-center rounded-md border",
          currentPage === 1
            ? "pointer-events-none opacity-40"
            : "hover:bg-accent"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`e-${i}`}
            className="h-9 w-9 flex items-center justify-center text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(searchParams, p)}
            className={cn(
              "h-9 w-9 flex items-center justify-center rounded-md border text-sm font-medium",
              p === currentPage
                ? "bg-foreground text-background border-foreground"
                : "hover:bg-accent"
            )}
          >
            {p}
          </Link>
        )
      )}
      <Link
        href={buildHref(searchParams, Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={cn(
          "h-9 w-9 flex items-center justify-center rounded-md border",
          currentPage === totalPages
            ? "pointer-events-none opacity-40"
            : "hover:bg-accent"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
