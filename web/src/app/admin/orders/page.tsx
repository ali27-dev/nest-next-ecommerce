"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { apiAuthGet, apiAuthDelete } from "@/lib/api";
import { Order } from "@/types/order";
import { orderStatusLabel } from "@/lib/order-labels";
import { FullPageSpinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminBackButton } from "@/components/admin /admin-back-button";
import { ConfirmDialog } from "@/components/admin /confirm-dialog";

const statusFilters = [
  "ALL",
  "PENDING",
  "PROCESSING",
  "DELIVERED",
  "CANCELLED",
  "FAILED",
] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<(typeof statusFilters)[number]>("ALL");
  const [search, setSearch] = useState("");
  const [confirmTarget, setConfirmTarget] = useState<{
    id: string;
    orderNumber: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function load() {
    apiAuthGet<Order[]>("/orders/admin/all")
      .then(setOrders)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load orders")
      );
  }

  useEffect(load, []);

  const filtered = useMemo(() => {
    if (!orders) return [];
    return orders.filter((o) => {
      const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
      const matchesSearch =
        !search ||
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.email.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, search]);

  const counts = useMemo(() => {
    if (!orders) return {} as Record<string, number>;
    return orders.reduce<Record<string, number>>((acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1;
      return acc;
    }, {});
  }, [orders]);

  async function confirmDelete() {
    if (!confirmTarget) return;
    setDeletingId(confirmTarget.id);
    setError(null);
    try {
      await apiAuthDelete(`/orders/admin/${confirmTarget.id}`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete order");
    } finally {
      setDeletingId(null);
      setConfirmTarget(null);
    }
  }

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!orders) return <FullPageSpinner />;

  return (
    <div>
      <AdminBackButton />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              statusFilter === s
                ? "bg-foreground text-background border-foreground"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            {s !== "ALL" && counts[s] ? ` (${counts[s]})` : ""}
          </button>
        ))}
      </div>

      <Input
        placeholder="Search by order number or customer email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-10 max-w-sm mb-6"
      />

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No orders match.</p>
      ) : (
        <div className="border rounded-xl divide-y bg-background overflow-x-auto">
          {filtered.map((order) => {
            const status = orderStatusLabel(order.status);
            const itemCount = order.orderItems.reduce(
              (sum, i) => sum + i.quantity,
              0
            );
            return (
              <div
                key={order.id}
                className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 p-4 hover:bg-accent transition-colors"
              >
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="min-w-0 flex-1 basis-full sm:basis-auto"
                >
                  <p className="text-sm font-mono font-medium truncate">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {order.user
                      ? `${order.user.firstName ?? ""} ${
                          order.user.lastName ?? ""
                        }`.trim() || order.user.email
                      : "—"}
                  </p>
                </Link>
                <p className="text-xs text-muted-foreground w-24 shrink-0">
                  {new Date(order.createdAt).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <p className="text-xs text-muted-foreground w-16 shrink-0">
                  {itemCount} items
                </p>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${status.className}`}
                >
                  {status.label}
                </span>
                <p className="text-sm font-mono w-20 sm:w-24 text-right shrink-0">
                  Rs {Number(order.totalAmount).toLocaleString()}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setConfirmTarget({
                      id: order.id,
                      orderNumber: order.orderNumber,
                    })
                  }
                  className="text-destructive hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        title="Delete order?"
        description={`Order ${confirmTarget?.orderNumber} and its items/payment record will be permanently deleted. This cannot be undone.`}
        loading={deletingId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
