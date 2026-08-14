"use client";

import { useEffect, useState } from "react";
import { apiAuthGet, apiAuthPatch } from "@/lib/api";
import { Payment } from "@/types/order";
import { Button } from "@/components/ui/button";
import { FullPageSpinner } from "@/components/ui/spinner";
import { paymentStatusLabel } from "@/lib/order-labels";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadPending() {
    const data = await apiAuthGet<Payment[]>("/payments/admin/pending");
    setPayments(data);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPending().catch((err) =>
      setError(err instanceof Error ? err.message : "Failed to load")
    );
  }, []);

  async function handleVerify(paymentId: string, approve: boolean) {
    setProcessingId(paymentId);
    setError(null);
    try {
      await apiAuthPatch(`/payments/admin/${paymentId}/verify`, { approve });
      await loadPending();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update payment");
    } finally {
      setProcessingId(null);
    }
  }

  if (!payments) return <FullPageSpinner />;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Pending Payments</h1>
      <p className="text-sm text-muted-foreground mb-6">
        EasyPaisa and Bank Transfer payments awaiting manual verification. Cash
        on Delivery orders don&apos;t require this step.
      </p>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {payments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No payments waiting for verification.
        </p>
      ) : (
        <div className="border rounded-xl divide-y">
          {payments.map((payment) => {
            const status = paymentStatusLabel(payment.status);
            const isProcessing = processingId === payment.id;
            return (
              <div
                key={payment.id}
                className="p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-medium">
                    Order {payment.order?.orderNumber ?? payment.orderId}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {payment.paymentMethod.replace("_", " ")} — Ref:{" "}
                    {payment.transactionId ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Rs {Number(payment.amount).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}
                  >
                    {status.label}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isProcessing}
                    onClick={() => handleVerify(payment.id, false)}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    disabled={isProcessing}
                    onClick={() => handleVerify(payment.id, true)}
                  >
                    {isProcessing ? "..." : "Approve"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
