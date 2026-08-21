"use client";

import { useState } from "react";
import { apiAuthPatch } from "@/lib/api";
import { Button } from "@/components/ui/button";

const statuses = [
  "PENDING",
  "PROCESSING",
  "DELIVERED",
  "CANCELLED",
  "FAILED",
] as const;

export function OrderStatusControl({
  orderId,
  currentStatus,
  onUpdated,
}: {
  orderId: string;
  currentStatus: string;
  onUpdated: () => void;
}) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(status: string) {
    setUpdating(status);
    setError(null);
    try {
      await apiAuthPatch(`/orders/admin/${orderId}/status`, { status });
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="rounded-xl border bg-background p-4 mb-6">
      <p className="text-sm font-semibold mb-3">Update Status</p>
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={s === currentStatus ? "default" : "outline"}
            disabled={s === currentStatus || updating !== null}
            onClick={() => handleChange(s)}
          >
            {updating === s ? "..." : s.charAt(0) + s.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
