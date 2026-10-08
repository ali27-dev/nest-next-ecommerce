"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Copy, ShieldCheck, Lock, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiAuthGet, apiAuthPost, UnauthorizedError } from "@/lib/api";
import { Order } from "@/types/order";
import { FullPageSpinner, Spinner } from "@/components/ui/spinner";
import { paymentAccounts } from "@/lib/site-content";
import { cn } from "@/lib/utils";

type PayMethod = "COD" | "EASY_PAISA" | "BANK_TRANSFER";

const methodOptions: { value: PayMethod; label: string; hint: string }[] = [
  { value: "EASY_PAISA", label: "EasyPaisa", hint: "Send money from the app" },
  { value: "BANK_TRANSFER", label: "Bank Transfer", hint: "Transfer to our account" },
  { value: "COD", label: "Cash on Delivery", hint: "Pay when it arrives" },
];

const TXN_PATTERN = /^[A-Za-z0-9][A-Za-z0-9\-_/]*$/;

function isPayMethod(value: string | null): value is PayMethod {
  return value === "COD" || value === "EASY_PAISA" || value === "BANK_TRANSFER";
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the value is still visible to copy by hand */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border bg-background px-3 text-xs font-medium hover:bg-muted transition-colors"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-green-600" /> Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" /> Copy
        </>
      )}
    </button>
  );
}

function ProgressSteps({ current }: { current: 1 | 2 | 3 }) {
  const steps = ["Order placed", "Payment", "Verification"];
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-3 mb-8 text-xs sm:text-sm">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-3">
            <span
              className={cn(
                "flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border text-xs font-semibold",
                done && "bg-foreground text-background border-foreground",
                active && "border-foreground",
                !done && !active && "text-muted-foreground"
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : n}
            </span>
            <span
              className={cn(
                active ? "font-medium" : "text-muted-foreground",
                !active && "hidden sm:inline"
              )}
            >
              {label}
            </span>
            {n < steps.length && (
              <span className="h-px w-5 sm:w-10 bg-border" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function PayGatewayPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const methodParam = searchParams.get("method");

  const [order, setOrder] = useState<Order | null>(null);
  const [method, setMethod] = useState<PayMethod | null>(
    isPayMethod(methodParam) ? methodParam : null
  );
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loginRedirect = `/login?redirect=${encodeURIComponent(
    `/checkout/pay?orderId=${orderId}${method ? `&method=${method}` : ""}`
  )}&expired=1`;

  useEffect(() => {
    if (!orderId) {
      router.replace("/orders");
      return;
    }
    apiAuthGet<Order>(`/orders/${orderId}`)
      .then((o) => {
        const rejected = o.status === "FAILED" && o.payment?.status === "FAILED";
        // Nothing left to pay: already paid/submitted, or the order is closed.
        if (o.status === "CANCELLED" || (o.payment && !rejected)) {
          router.replace(`/orders/${o.id}`);
          return;
        }
        setOrder(o);
      })
      .catch((err) => {
        if (err instanceof UnauthorizedError) {
          router.replace(loginRedirect);
          return;
        }
        router.replace("/orders");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, router]);

  if (!order) return <FullPageSpinner />;

  const rejectionReason =
    order.status === "FAILED" ? order.payment?.rejectionReason : null;
  const account = method && method !== "COD" ? paymentAccounts[method] : null;
  const total = `Rs. ${Number(order.totalAmount).toLocaleString()}`;

  function selectMethod(next: PayMethod) {
    setMethod(next);
    setError(null);
    setTransactionId("");
  }

  async function submitPayment(body: Record<string, unknown>) {
    setError(null);
    setLoading(true);
    try {
      await apiAuthPost("/payments", body);
      router.push(`/orders/${orderId}?placed=1`);
      // keep the button busy until the order page takes over
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        router.replace(loginRedirect);
        return;
      }
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  function handleManualSubmit(e: FormEvent) {
    e.preventDefault();
    const ref = transactionId.trim();
    if (ref.length < 6 || !TXN_PATTERN.test(ref)) {
      setError(
        "Enter a valid reference (at least 6 characters; letters, numbers, - and / only)."
      );
      return;
    }
    submitPayment({ orderId, paymentMethod: method, transactionId: ref });
  }

  return (
    <div className="bg-neutral-50/80 min-h-[70vh]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-10 py-8 md:py-12">
        <ProgressSteps current={2} />

        <h1 className="font-heading text-2xl md:text-4xl font-semibold text-center mb-2">
          Complete your payment
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-8 md:mb-10">
          Your order <span className="font-mono">{order.orderNumber}</span> is
          reserved. Finish payment so we can start processing it.
        </p>

        {rejectionReason && (
          <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 text-red-800 p-4 mb-6">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">
                Your previous payment could not be verified
              </p>
              <p className="text-sm mt-1">{rejectionReason}</p>
              <p className="text-xs mt-1 text-red-700">
                Please check the details and submit the payment again.
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* Order summary: first on mobile so the amount is clear */}
          <aside className="lg:col-span-2 lg:order-2 rounded-2xl border bg-background p-5 shadow-sm lg:sticky lg:top-24">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Amount to pay
            </p>
            <div className="flex items-center justify-between gap-3 mt-1">
              <p className="text-3xl font-semibold">{total}</p>
              <CopyButton
                value={String(Number(order.totalAmount))}
                label="amount"
              />
            </div>

            <ul className="mt-5 divide-y border-t">
              {order.orderItems.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-3">
                  <div className="h-14 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                    {item.product?.imageUrl && (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">
                      {item.product?.name ?? "Product"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty {item.quantity}
                      {item.size ? ` · Size ${item.size}` : ""}
                    </p>
                  </div>
                  <p className="text-sm font-mono shrink-0">
                    Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>

            <div className="border-t pt-3 flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span className="font-mono">{total}</span>
            </div>
          </aside>

          {/* Payment panel */}
          <section className="lg:col-span-3 lg:order-1 rounded-2xl border bg-background p-5 md:p-6 shadow-sm">
            <h2 className="text-sm font-semibold mb-3">Payment method</h2>
            <div
              role="radiogroup"
              aria-label="Payment method"
              className="grid grid-cols-1 sm:grid-cols-3 gap-2"
            >
              {methodOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={method === opt.value}
                  onClick={() => selectMethod(opt.value)}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-left transition-colors",
                    method === opt.value
                      ? "border-foreground bg-muted/50"
                      : "hover:bg-muted/30"
                  )}
                >
                  <span className="block text-sm font-medium">{opt.label}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    {opt.hint}
                  </span>
                </button>
              ))}
            </div>

            {!method && (
              <p className="text-sm text-muted-foreground mt-6">
                Choose a payment method to continue.
              </p>
            )}

            {/* EasyPaisa / Bank transfer */}
            {account && (
              <form onSubmit={handleManualSubmit} className="mt-6 space-y-5">
                <div className="rounded-xl border bg-muted/30 p-4">
                  <p className="text-sm font-semibold mb-3">
                    Send payment to
                  </p>
                  <dl className="space-y-3">
                    {account.details.map((d) => (
                      <div
                        key={d.label}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <dt className="text-xs text-muted-foreground">
                            {d.label}
                          </dt>
                          <dd className="text-sm font-mono break-all">
                            {d.value}
                          </dd>
                        </div>
                        {d.copyable && (
                          <CopyButton value={d.value} label={d.label} />
                        )}
                      </div>
                    ))}
                  </dl>
                </div>

                <ol className="space-y-2 text-sm text-muted-foreground">
                  {account.steps.map((step, i) => (
                    <li key={step} className="flex gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>

                <div>
                  <label htmlFor="transactionId" className="text-sm font-medium">
                    {account.fieldLabel}
                  </label>
                  <Input
                    id="transactionId"
                    required
                    autoComplete="off"
                    autoCapitalize="characters"
                    inputMode="text"
                    placeholder="e.g. 1234567890"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="mt-1.5 h-12 font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {account.fieldHint}
                  </p>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-full"
                >
                  {loading && <Spinner className="mr-2" />}
                  {loading
                    ? "Submitting..."
                    : `I've paid ${total} — Submit`}
                </Button>
              </form>
            )}

            {/* Cash on delivery */}
            {method === "COD" && (
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground leading-relaxed">
                  Pay <span className="font-semibold text-foreground">{total}</span>{" "}
                  in cash to the courier when your order arrives. Please keep
                  the exact amount ready.
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    submitPayment({ orderId, paymentMethod: "COD" })
                  }
                  className="h-12 w-full rounded-full"
                >
                  {loading && <Spinner className="mr-2" />}
                  {loading ? "Confirming..." : "Confirm Cash on Delivery"}
                </Button>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> Secure checkout
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> Manually verified by our
                team
              </span>
            </div>

            <div className="mt-5 border-t pt-4 text-center text-sm">
              <Link
                href={`/orders/${order.id}`}
                className="text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                Pay later from My Orders
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
