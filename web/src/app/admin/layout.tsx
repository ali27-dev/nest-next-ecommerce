import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Tags,
  Shirt,
  ShoppingBag,
  CreditCard,
} from "lucide-react";

import { AdminGuard } from "@/components/admin /admin-guard";
import { AdminTopBar } from "@/components/admin /admin-top-bar";
import { AdminNavList } from "@/components/admin /admin-nav";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Fabrics", href: "/admin/fabrics", icon: Shirt },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-muted/30">
        <aside className="w-60 shrink-0 border-r bg-background hidden md:flex flex-col">
          <div className="h-16 flex items-center px-6 border-b">
            <span className="text-lg font-semibold tracking-tight">
              Farzara Admin
            </span>
          </div>
          <nav aria-label="Admin navigation" className="flex-1 py-4">
            <AdminNavList />
          </nav>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopBar />
          <main className="flex-1 px-6 md:px-8 py-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
