"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiAuthGet } from "@/lib/api";
import { Order } from "@/types/order";
import { orderStatusLabel, paymentStatusLabel } from "@/lib/order-labels";
import { FullPageSpinner } from "@/components/ui/spinner";
import { AdminBackButton } from "@/components/admin /admin-back-button";
import { OrderStatusControl } from "@/components/admin /order-status-control";

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    apiAuthGet<Order>(`/orders/admin/${params.id}`)
      .then(setOrder)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Order not found")
      );
  }

  useEffect(load, [params.id]);

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!order) return <FullPageSpinner />;

  const status = orderStatusLabel(order.status);
  const paymentStatus = order.payment
    ? paymentStatusLabel(order.payment.status)
    : null;

  return (
    <div className="max-w-2xl">
      <AdminBackButton />

      <div className="flex items-start justify-between mb-6 mt-4">
        <div>
          <p className="text-xs text-muted-foreground">Order</p>
          <h1 className="text-lg font-semibold font-mono">
            {order.orderNumber}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {order.user
              ? `${order.user.firstName ?? ""} ${
                  order.user.lastName ?? ""
                }`.trim() || order.user.email
              : "—"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}
          >
            {status.label}
          </span>
          {paymentStatus && (
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${paymentStatus.className}`}
            >
              {paymentStatus.label}
            </span>
          )}
        </div>
      </div>

      <OrderStatusControl
        orderId={order.id}
        currentStatus={order.status}
        onUpdated={load}
      />

      {order.payment?.status === "PENDING" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 p-4 mb-6 flex items-center justify-between gap-3">
          <p className="text-sm">
            This order&apos;s payment hasn&apos;t been verified yet.
          </p>
          <Link
            href="/admin/payments"
            className="text-sm font-medium underline shrink-0"
          >
            Go to Payments
          </Link>
        </div>
      )}

      {order.status === "FAILED" && order.payment?.rejectionReason && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 p-4 mb-6">
          <p className="text-sm font-medium">Payment rejected</p>
          <p className="text-sm mt-1">{order.payment.rejectionReason}</p>
        </div>
      )}

      <div className="border rounded-xl divide-y bg-background">
        {order.orderItems.map((item) => (
          <div key={item.id} className="flex gap-4 p-4">
            <div className="h-16 w-14 rounded-md overflow-hidden bg-muted shrink-0">
              {item.product?.imageUrl && (
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <p className="text-sm">{item.product?.name ?? "Product"}</p>
                <p className="text-xs text-muted-foreground">
                  Qty {item.quantity}
                </p>
              </div>
              <p className="text-sm font-mono">
                Rs {(Number(item.price) * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-base font-semibold mt-4 px-1">
        <span>Total</span>
        <span className="font-mono">
          Rs {Number(order.totalAmount).toLocaleString()}
        </span>
      </div>

      {order.shippingAddress && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold mb-2">Shipping Address</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {order.shippingAddress}
          </p>
        </div>
      )}
    </div>
  );
}
