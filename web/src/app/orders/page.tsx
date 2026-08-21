"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiAuthGet } from "@/lib/api";
import { Order } from "@/types/order";
import { useAuth } from "@/contexts/auth-context";
import { orderStatusLabel } from "@/lib/order-labels";
import { FullPageSpinner } from "@/components/ui/spinner";

export default function OrdersPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/orders");
      return;
    }
    apiAuthGet<Order[]>("/orders")
      .then(setOrders)
      .catch(() => setOrders([]));
  }, [isLoggedIn, router]);

  if (!orders) return <FullPageSpinner />;

  return (
    <div className="px-6 md:px-10 py-8 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You haven&apos;t placed any orders yet.
        </p>
      ) : (
        <div className="border rounded-xl divide-y">
          {orders.map((order) => {
            const status = orderStatusLabel(order.status);
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex items-center justify-between p-4 hover:bg-accent transition-colors"
              >
                <div>
                  <p className="text-sm font-mono font-medium">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-PK", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}
                  >
                    {status.label}
                  </span>
                  <p className="text-sm font-mono">
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
