// src/components/admin/admin-guard.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { FullPageSpinner } from "@/components/ui/spinner";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/admin");
      return;
    }
    if (user && user.role !== "ADMIN") {
      router.push("/");
    }
  }, [isLoggedIn, user, router]);

  if (!user || user.role !== "ADMIN") {
    return <FullPageSpinner />;
  }

  return <>{children}</>;
}
