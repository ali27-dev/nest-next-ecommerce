"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminNavList } from "./admin-nav";
import { AdminUserFooter } from "./admin-user-footer";

export function AdminMobileNav({ triggerOnly }: { triggerOnly?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open admin menu"
        className={
          triggerOnly
            ? "h-9 w-9 flex items-center justify-center rounded-md hover:bg-accent -ml-2"
            : "fixed top-4 left-4 z-30 h-10 w-10 rounded-full bg-background border shadow-md flex items-center justify-center"
        }
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
        <div className="h-16 flex items-center justify-between px-5 border-b shrink-0">
          <span className="text-base font-semibold">Farzara Admin</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 px-5 py-3 text-sm text-muted-foreground hover:text-foreground border-b"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Store
        </Link>

        <nav
          aria-label="Admin navigation"
          className="flex-1 py-4 overflow-y-auto"
        >
          <AdminNavList onNavigate={() => setOpen(false)} />
        </nav>

        <AdminUserFooter />
      </aside>
    </div>
  );
}
