"use client";

import { useAuth } from "@/contexts/auth-context";

export function AdminTopBar() {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6 md:px-8">
      <span className="text-sm text-muted-foreground md:hidden font-medium">
        Farzara Admin
      </span>
      <span className="hidden md:block" />

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
