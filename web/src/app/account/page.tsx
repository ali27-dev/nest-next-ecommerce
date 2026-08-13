"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export default function AccountPage() {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold mb-8">My Account</h1>

      <div className="border rounded-xl p-6 flex flex-col gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Name</p>
          <p className="text-sm font-medium">
            {[user.firstName, user.lastName].filter(Boolean).join(" ") || "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Email</p>
          <p className="text-sm font-medium">{user.email}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Role</p>
          <p className="text-sm font-medium">{user.role}</p>
        </div>
      </div>

      {/* Coming soon: order history (GET /orders), editable profile fields,
          saved addresses. This page currently only confirms the session
          and provides a way to log out. */}
      <p className="text-sm text-muted-foreground mt-6">
        Order history and profile editing are coming soon.
      </p>

      <Button onClick={logout} variant="outline" className="mt-6 h-11">
        Log Out
      </Button>
    </div>
  );
}
