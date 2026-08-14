"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminNavList } from "./admin-nav";

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open admin menu"
        className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-accent"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div
        onClick={() => setOpen(false)}
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
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r flex flex-col transition-transform duration-200 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b">
          <span className="text-base font-semibold">Farzara Admin</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav aria-label="Admin navigation" className="flex-1 py-4">
          <AdminNavList onNavigate={() => setOpen(false)} />
        </nav>
      </aside>
    </div>
  );
}
