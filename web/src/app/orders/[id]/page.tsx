"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { apiAuthGet, apiAuthPatch, UnauthorizedError } from "@/lib/api";
import { Order } from "@/types/order";
import { useAuth } from "@/contexts/auth-context";
import { orderStatusLabel, paymentStatusLabel } from "@/lib/order-labels";
import { Button } from "@/components/ui/button";
import { FullPageSpinner } from "@/components/ui/spinner";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const justPlaced = searchParams.get("placed") === "1";
  const [cancelling, setCancelling] = useState(false);

  function load() {
    apiAuthGet<Order>(`/orders/${params.id}`)
      .then(setOrder)
      .catch((err) => {
        if (err instanceof UnauthorizedError) {
          router.push(`/login?redirect=/orders/${params.id}&expired=1`);
          return;
        }
        setError(err instanceof Error ? err.message : "Order not found");
      });
  }

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/orders/${params.id}`);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, isLoggedIn]);

  async function handleCancel() {
    if (!confirm("Cancel this order? This cannot be undone.")) return;
    setCancelling(true);
    try {
      await apiAuthPatch(`/orders/${params.id}/cancel`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  }

  if (error) {
    return (
      <div className="px-6 py-24 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button asChild variant="outline" className="mt-6 h-11">
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  if (!order) return <FullPageSpinner />;

  const status = orderStatusLabel(order.status);
  const paymentStatus = order.payment
    ? paymentStatusLabel(order.payment.status)
    : null;

  return (
    <div className="px-6 md:px-10 py-8 max-w-3xl mx-auto">
      {justPlaced && (
        <div className="flex items-center gap-3 border border-green-200 bg-green-50 text-green-800 rounded-xl px-5 py-4 mb-8">
          <CheckCircle2 className="h-6 w-6 shrink-0" />
          <div>
            <p className="text-sm font-medium">Order placed successfully!</p>
            {paymentStatus?.label === "Awaiting Verification" && (
              <p className="text-xs mt-0.5">
                We&apos;ll confirm your payment shortly. You can check back here
                anytime.
              </p>
            )}
          </div>
        </div>
      )}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs text-muted-foreground">Order</p>
          <h1 className="text-lg font-semibold font-mono">
            {order.orderNumber}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Placed{" "}
            {new Date(order.createdAt).toLocaleDateString("en-PK", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
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
      {order.status === "FAILED" && order.payment?.rejectionReason && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 p-4 mb-6">
          <p className="text-sm font-medium">
            Your payment could not be verified
          </p>
          <p className="text-sm mt-1">{order.payment.rejectionReason}</p>
        </div>
      )}
      {(order.status === "PENDING" || order.status === "PROCESSING") && (
        <div className="flex justify-end mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={cancelling}
            className="text-destructive hover:text-destructive"
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </Button>
        </div>
      )}
      <div className="border rounded-xl divide-y">
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
      {order.payment && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold mb-2">Payment</h2>
          <p className="text-sm text-muted-foreground">
            {order.payment.paymentMethod.replace("_", " ")}
            {order.payment.transactionId &&
              ` — Ref: ${order.payment.transactionId}`}
          </p>
        </div>
      )}
      {/* <div className="flex items-center"> */}
      <Button asChild variant="outline" className="mt-8 h-11">
        <Link href="/">Continue Shopping</Link>
      </Button>
    </div>
  );
}
