"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiAuthGet, apiAuthPost, UnauthorizedError } from "@/lib/api";
import { Order } from "@/types/order";
import { useCart } from "@/contexts/cart-context";
import { FullPageSpinner, Spinner } from "@/components/ui/spinner";

const methodConfig = {
  EASY_PAISA: {
    label: "EasyPaisa",
    instructions:
      "Send payment to EasyPaisa account 03XX-XXXXXXX (Farzara Store), then enter the transaction ID below.",
    fieldLabel: "EasyPaisa Transaction ID",
  },
  BANK_TRANSFER: {
    label: "Bank Transfer",
    instructions:
      "Transfer to our bank account (IBAN: PK00XXXX0000000000000000, Farzara Store), then enter the reference number below.",
    fieldLabel: "Bank Reference Number",
  },
} as const;

export default function PayGatewayPage() {
  const { clear } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const method = searchParams.get("method") as keyof typeof methodConfig | null;

  const [order, setOrder] = useState<Order | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId || !method || !methodConfig[method]) {
      router.push("/");
      return;
    }
    apiAuthGet<Order>(`/orders/${orderId}`)
      .then(setOrder)
      .catch((err) => {
        if (err instanceof UnauthorizedError) {
          router.push(
            `/login?redirect=/checkout/pay?orderId=${orderId}&method=${method}&expired=1`
          );
          return;
        }
        router.push("/");
      });
  }, [orderId, method, router]);

  if (!order || !method) return <FullPageSpinner />;

  const config = methodConfig[method];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiAuthPost("/payments", {
        orderId,
        paymentMethod: method,
        transactionId,
      });
      clear();
      router.push(`/orders/${orderId}?placed=1`);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        router.push(
          `/login?redirect=/checkout/pay?orderId=${orderId}&method=${method}&expired=1`
        );
        return;
      }
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="border rounded-xl p-6 mb-6">
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="text-3xl font-semibold mt-1">
            PKR {Number(order.totalAmount).toLocaleString()}
          </p>
          <div className="border-t mt-4 pt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order no.</span>
              <span className="font-mono">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Store</span>
              <span>Farzara Store</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Method</span>
              <span>{config.label}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">{config.instructions}</p>

          <div>
            <label htmlFor="transactionId" className="text-sm font-medium">
              {config.fieldLabel}
            </label>
            <Input
              id="transactionId"
              required
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="mt-1.5 h-11"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={loading} className="h-12">
            {loading && <Spinner className="mr-2" />}
            {loading ? "Confirming..." : `Confirm ${config.label} Payment`}
          </Button>
        </form>
      </div>
    </div>
  );
}
