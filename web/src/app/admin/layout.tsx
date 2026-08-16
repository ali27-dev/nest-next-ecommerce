import { AdminGuard } from "@/components/admin /admin-guard";
import { AdminNavList } from "./admin-nav";
import { AdminUserFooter } from "@/components/admin /admin-user-footer";
import { AdminPageHeader } from "@/components/admin /admin-page-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-muted/30">
        <aside className="w-60 shrink-0 border-r bg-background hidden md:flex flex-col">
          <div className="h-16 flex items-center px-5 border-b shrink-0">
            <span className="text-base font-semibold tracking-tight">
              Farzara Admin
            </span>
          </div>

          <nav
            aria-label="Admin navigation"
            className="flex-1 py-4 overflow-y-auto"
          >
            <AdminNavList />
          </nav>

          <AdminUserFooter />
        </aside>

        <div className="flex-1 min-w-0 flex flex-col">
          <AdminPageHeader />
          <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 md:py-8">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
