"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { apiAuthGet, apiAuthPost } from "@/lib/api";
import { SupportTicket, TicketCategory } from "@/types/support";
import { Order } from "@/types/order";
import { useAuth } from "@/contexts/auth-context";
import { ticketStatusLabel, ticketCategoryLabel } from "@/lib/support-labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FullPageSpinner } from "@/components/ui/spinner";

const categories: { value: TicketCategory; label: string }[] = [
  { value: "PRODUCT", label: "Product" },
  { value: "DELIVERY", label: "Delivery" },
  { value: "PAYMENT", label: "Payment" },
  { value: "OTHER", label: "Other" },
];

export default function SupportPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [tickets, setTickets] = useState<SupportTicket[] | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<TicketCategory>("PRODUCT");
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function load() {
    apiAuthGet<SupportTicket[]>("/support").then(setTickets);
  }

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/support");
      return;
    }
    load();
    apiAuthGet<Order[]>("/orders")
      .then(setOrders)
      .catch(() => setOrders([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await apiAuthPost("/support", {
        subject,
        category,
        message,
        orderId: orderId || undefined,
      });
      setSubject("");
      setMessage("");
      setOrderId("");
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  }

  if (!tickets) return <FullPageSpinner />;

  return (
    <div className="px-6 md:px-10 py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold">Support</h1>
        <Button
          size="sm"
          onClick={() => setShowForm((s) => !s)}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" /> New Ticket
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Questions about a product, delivery, or payment? Open a ticket and
        we&apos;ll get back to you.
      </p>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="border rounded-xl p-5 mb-8 flex flex-col gap-4"
        >
          <div>
            <label className="text-sm font-medium">Subject</label>
            <Input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1.5 h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="mt-1.5 w-full h-10 rounded-md border bg-background px-3 text-sm"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">
                Related order (optional)
              </label>
              <select
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="mt-1.5 w-full h-10 rounded-md border bg-background px-3 text-sm"
              >
                <option value="">None</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.orderNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Message</label>
            <Textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1.5"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            disabled={submitting}
            className="h-10 w-fit px-6"
          >
            {submitting ? "Submitting..." : "Submit Ticket"}
          </Button>
        </form>
      )}

      {tickets.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You haven&apos;t opened any support tickets yet.
        </p>
      ) : (
        <div className="border rounded-xl divide-y">
          {tickets.map((ticket) => {
            const status = ticketStatusLabel(ticket.status);
            return (
              <Link
                key={ticket.id}
                href={`/support/${ticket.id}`}
                className="flex items-center justify-between gap-4 p-4 hover:bg-accent transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {ticket.subject}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {ticketCategoryLabel(ticket.category)}
                    {ticket.order && ` · Order ${ticket.order.orderNumber}`}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${status.className}`}
                >
                  {status.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
