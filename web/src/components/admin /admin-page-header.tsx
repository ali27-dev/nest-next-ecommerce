"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store } from "lucide-react";
import { adminNavItems } from "./admin-nav";
import { AdminMobileNav } from "./admin-mobile";

function getPageTitle(pathname: string): string {
  // Match the most specific nav item whose href the current path starts
  // with, so nested routes (e.g. /admin/products/123) still resolve to
  // "Products" rather than falling through to nothing.
  const match = [...adminNavItems]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) =>
      item.href === "/admin"
        ? pathname === item.href
        : pathname.startsWith(item.href)
    );
  return match?.label ?? "Admin";
}

export function AdminPageHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4 sm:px-6 md:px-8">
      <div className="flex items-center gap-3">
        <AdminMobileNav triggerOnly />
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <Link
        href="/"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Store className="h-4 w-4" />
        <span className="hidden sm:inline">View Store</span>
      </Link>
    </header>
  );
}
