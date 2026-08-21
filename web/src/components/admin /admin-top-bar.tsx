// src/components/admin/admin-top-bar.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { AdminMobileNav } from "@/app/admin/admin-mobile-nav";

export function AdminTopBar() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4 sm:px-6 md:px-8">
      <div className="flex items-center gap-3">
        <AdminMobileNav />
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium leading-tight">
            {[user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
              user?.email}
          </p>
          <p className="text-xs text-muted-foreground leading-tight">Admin</p>
        </div>
        <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
          {user?.firstName?.[0]?.toUpperCase() ??
            user?.email?.[0]?.toUpperCase() ??
            "A"}
        </div>
      </div>
    </header>
  );
}
