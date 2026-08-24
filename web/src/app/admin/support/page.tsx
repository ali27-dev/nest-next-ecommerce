"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiAuthGet } from "@/lib/api";
import { SupportTicket, TicketStatus } from "@/types/support";
import { ticketStatusLabel, ticketCategoryLabel } from "@/lib/support-labels";
import { FullPageSpinner } from "@/components/ui/spinner";
import { AdminBackButton } from "@/components/admin /admin-back-button";

const statusFilters: (TicketStatus | "ALL")[] = [
  "ALL",
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[] | null>(null);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "ALL">("ALL");

  useEffect(() => {
    apiAuthGet<SupportTicket[]>("/support/admin/all").then(setTickets);
  }, []);

  const counts = useMemo(() => {
    if (!tickets) return {} as Record<string, number>;
    return tickets.reduce<Record<string, number>>((acc, t) => {
      acc[t.status] = (acc[t.status] ?? 0) + 1;
      return acc;
    }, {});
  }, [tickets]);

  const filtered = useMemo(() => {
    if (!tickets) return [];
    return statusFilter === "ALL"
      ? tickets
      : tickets.filter((t) => t.status === statusFilter);
  }, [tickets, statusFilter]);

  if (!tickets) return <FullPageSpinner />;

  return (
    <div>
      <AdminBackButton />

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              statusFilter === s
                ? "bg-foreground text-background border-foreground"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            {s === "ALL" ? "All" : ticketStatusLabel(s).label}
            {s !== "ALL" && counts[s] ? ` (${counts[s]})` : ""}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tickets match.</p>
      ) : (
        <div className="border rounded-xl divide-y bg-background">
          {filtered.map((ticket) => {
            const status = ticketStatusLabel(ticket.status);
            return (
              <Link
                key={ticket.id}
                href={`/admin/support/${ticket.id}`}
                className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-4 hover:bg-accent transition-colors"
              >
                <div className="min-w-0 flex-1 basis-full sm:basis-auto">
                  <p className="text-sm font-medium truncate">
                    {ticket.subject}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {ticket.user
                      ? `${ticket.user.firstName ?? ""} ${
                          ticket.user.lastName ?? ""
                        }`.trim() || ticket.user.email
                      : "—"}
                    {" · "}
                    {ticketCategoryLabel(ticket.category)}
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
