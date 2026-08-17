"use client";

import { useEffect, useState } from "react";
import { apiAuthGet, apiAuthPatch } from "@/lib/api";
import { Payment } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FullPageSpinner } from "@/components/ui/spinner";
import { paymentStatusLabel } from "@/lib/order-labels";
import { AdminBackButton } from "@/components/admin /admin-back-button";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Payment | null>(null);
  const [reason, setReason] = useState("");

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

  async function handleApprove(paymentId: string) {
    setProcessingId(paymentId);
    setError(null);
    try {
      await apiAuthPatch(`/payments/admin/${paymentId}/verify`, {
        approve: true,
      });
      await loadPending();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update payment");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject() {
    if (!rejectTarget || !reason.trim()) return;
    setProcessingId(rejectTarget.id);
    setError(null);
    try {
      await apiAuthPatch(`/payments/admin/${rejectTarget.id}/verify`, {
        approve: false,
        reason,
      });
      setRejectTarget(null);
      setReason("");
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
      <AdminBackButton />

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
        <div className="border rounded-xl divide-y bg-background">
          {payments.map((payment) => {
            const status = paymentStatusLabel(payment.status);
            const isProcessing = processingId === payment.id;
            return (
              <div
                key={payment.id}
                className="p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    Order {payment.order?.orderNumber ?? payment.orderId}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
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
                    onClick={() => setRejectTarget(payment)}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    disabled={isProcessing}
                    onClick={() => handleApprove(payment.id)}
                  >
                    {isProcessing ? "..." : "Approve"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {rejectTarget && (
        <div
          onClick={() => setRejectTarget(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-background rounded-xl shadow-2xl p-6"
          >
            <h2 className="text-sm font-semibold mb-1">Reject payment</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Order {rejectTarget.order?.orderNumber ?? rejectTarget.orderId}
            </p>
            <label className="text-sm font-medium">Reason</label>
            <Textarea
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Transaction ID could not be verified against our records"
              rows={3}
              className="mt-1.5"
            />
            <div className="flex justify-end gap-2 mt-5">
              <Button
                variant="outline"
                onClick={() => setRejectTarget(null)}
                className="h-9"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={!reason.trim() || processingId === rejectTarget.id}
                className="h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
