import type { DashboardSupportTicket } from "../types";
import { DashboardCard } from "./DashboardCard";

type SupportTicketsPanelProps = {
  title: string;
  viewAllLabel: string;
  tickets: DashboardSupportTicket[];
  emptyLabel: string;
  pendingLabel: string;
};

export function SupportTicketsPanel({
  title,
  viewAllLabel,
  tickets,
  emptyLabel,
  pendingLabel,
}: SupportTicketsPanelProps) {
  return (
    <DashboardCard
      title={title}
      action={{ label: viewAllLabel, href: "/users/online-support" }}
      bodyClassName="overflow-auto p-0"
      className="h-[248px]"
    >
      {tickets.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted">{emptyLabel}</p>
      ) : (
        <ul className="divide-y divide-border/60">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="flex items-center gap-3 px-4 py-2.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{ticket.username}</p>
                <p className="text-[11px] text-muted">ID #{ticket.id}</p>
              </div>
              <span className="shrink-0 rounded-md bg-danger/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-danger">
                {ticket.pending_count} {pendingLabel}
              </span>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
