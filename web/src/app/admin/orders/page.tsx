"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiAuthGet } from "@/lib/api";
import { Order } from "@/types/order";
import { orderStatusLabel } from "@/lib/order-labels";
import { FullPageSpinner } from "@/components/ui/spinner";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiAuthGet<Order[]>("/orders/admin/all")
      .then(setOrders)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load orders")
      );
  }, []);

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!orders) return <FullPageSpinner />;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="border rounded-xl divide-y bg-background overflow-x-auto">
          {orders.map((order) => {
            const status = orderStatusLabel(order.status);
            return (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between gap-4 p-4 hover:bg-accent transition-colors"
              >
                <div className="min-w-0">
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
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}
                  >
                    {status.label}
                  </span>
                  <p className="text-sm font-mono w-24 text-right">
                    Rs {Number(order.totalAmount).toLocaleString()}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
