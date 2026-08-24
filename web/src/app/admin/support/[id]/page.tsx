"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import { useParams } from "next/navigation";
import { apiAuthGet, apiAuthPost, apiAuthPatch } from "@/lib/api";
import { SupportTicket, TicketStatus } from "@/types/support";
import { ticketStatusLabel, ticketCategoryLabel } from "@/lib/support-labels";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FullPageSpinner } from "@/components/ui/spinner";
import { AdminBackButton } from "@/components/admin /admin-back-button";

const statuses: TicketStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export default function AdminTicketDetailPage() {
  const params = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  function load() {
    apiAuthGet<SupportTicket>(`/support/admin/${params.id}`).then(setTicket);
  }

  useEffect(load, [params.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages.length]);

  async function handleReply(e: FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    setError(null);
    try {
      await apiAuthPost(`/support/admin/${params.id}/messages`, {
        message: reply,
      });
      setReply("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  }

  async function handleStatusChange(status: TicketStatus) {
    setUpdatingStatus(status);
    try {
      await apiAuthPatch(`/support/admin/${params.id}/status`, { status });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  }

  if (!ticket) return <FullPageSpinner />;

  return (
    <div className="max-w-2xl">
      <AdminBackButton />

      <div className="flex items-start justify-between mt-4 mb-2">
        <div>
          <h1 className="text-lg font-semibold">{ticket.subject}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {ticket.user
              ? `${ticket.user.firstName ?? ""} ${
                  ticket.user.lastName ?? ""
                }`.trim() || ticket.user.email
              : "—"}
            {" · "}
            {ticketCategoryLabel(ticket.category)}
            {ticket.order && ` · Order ${ticket.order.orderNumber}`}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={s === ticket.status ? "default" : "outline"}
            disabled={s === ticket.status || updatingStatus !== null}
            onClick={() => handleStatusChange(s)}
          >
            {updatingStatus === s ? "..." : ticketStatusLabel(s).label}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-3 mb-6">
        {ticket.messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
              msg.isFromAdmin
                ? "bg-primary text-primary-foreground self-end"
                : "bg-muted self-start"
            }`}
          >
            <p className="text-sm whitespace-pre-line">{msg.message}</p>
            <p
              className={`text-[10px] mt-1 ${
                msg.isFromAdmin
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              }`}
            >
              {msg.isFromAdmin ? "You (Support)" : "Customer"} ·{" "}
              {new Date(msg.createdAt).toLocaleString("en-PK", {
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleReply}
        className="border-t pt-4 flex flex-col gap-2"
      >
        <Textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Reply to customer..."
          rows={3}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          disabled={sending || !reply.trim()}
          className="h-10 w-fit px-6 self-end"
        >
          {sending ? "Sending..." : "Send Reply"}
        </Button>
      </form>
    </div>
  );
}
