"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiAuthGet, apiAuthPost } from "@/lib/api";
import { SupportTicket } from "@/types/support";
import { useAuth } from "@/contexts/auth-context";
import { ticketStatusLabel, ticketCategoryLabel } from "@/lib/support-labels";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FullPageSpinner } from "@/components/ui/spinner";

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  function load() {
    apiAuthGet<SupportTicket>(`/support/${params.id}`).then(setTicket);
  }

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/support/${params.id}`);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, isLoggedIn]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages.length]);

  async function handleReply(e: FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    setError(null);
    try {
      await apiAuthPost(`/support/${params.id}/messages`, { message: reply });
      setReply("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  }

  if (!ticket) return <FullPageSpinner />;

  const status = ticketStatusLabel(ticket.status);
  const closed = ticket.status === "CLOSED";

  return (
    <div className="px-6 md:px-10 py-8 max-w-2xl mx-auto">
      <Link
        href="/support"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to Support
      </Link>

      <div className="flex items-start justify-between mt-4 mb-6">
        <div>
          <h1 className="text-lg font-semibold">{ticket.subject}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {ticketCategoryLabel(ticket.category)}
            {ticket.order && ` · Order ${ticket.order.orderNumber}`}
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        {ticket.messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
              msg.isFromAdmin
                ? "bg-muted self-start"
                : "bg-primary text-primary-foreground self-end"
            }`}
          >
            <p className="text-sm whitespace-pre-line">{msg.message}</p>
            <p
              className={`text-[10px] mt-1 ${
                msg.isFromAdmin
                  ? "text-muted-foreground"
                  : "text-primary-foreground/70"
              }`}
            >
              {msg.isFromAdmin ? "Support Team" : "You"} ·{" "}
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

      {closed ? (
        <p className="text-sm text-muted-foreground text-center py-4 border-t">
          This ticket is closed. Open a new ticket if you need further help.
        </p>
      ) : (
        <form
          onSubmit={handleReply}
          className="border-t pt-4 flex flex-col gap-2"
        >
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply..."
            rows={3}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            disabled={sending || !reply.trim()}
            className="h-10 w-fit px-6 self-end"
          >
            {sending ? "Sending..." : "Send"}
          </Button>
        </form>
      )}
    </div>
  );
}
