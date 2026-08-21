"use client";

import { useAuth } from "@/contexts/auth-context";

export function AdminUserFooter() {
  const { user, logout } = useAuth();

  return (
    <div className="border-t p-4 shrink-0">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold shrink-0">
          {user?.firstName?.[0]?.toUpperCase() ??
            user?.email?.[0]?.toUpperCase() ??
            "A"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">
            {[user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
              user?.email}
          </p>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>
      </div>
      <button
        onClick={logout}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-3"
      >
        Log out
      </button>
    </div>
  );
}
