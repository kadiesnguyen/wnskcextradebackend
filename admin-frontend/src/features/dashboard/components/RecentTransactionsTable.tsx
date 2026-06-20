import type { Bill } from "@/features/bills/types";
import { billStLabel } from "@/lib/i18n/entity-labels";
import { useI18n } from "@/lib/i18n/useI18n";
import { formatTimestamp } from "../format";
import { DashboardCard } from "./DashboardCard";

type RecentTransactionsTableProps = {
  title: string;
  viewAllLabel: string;
  transactions: Bill[];
  emptyLabel: string;
  columns: {
    user: string;
    amount: string;
    coin: string;
    type: string;
    time: string;
  };
};

export function RecentTransactionsTable({
  title,
  viewAllLabel,
  transactions,
  emptyLabel,
  columns,
}: RecentTransactionsTableProps) {
  const { t: translate } = useI18n();

  return (
    <DashboardCard
      title={title}
      action={{ label: viewAllLabel, href: "/finance/bills" }}
      bodyClassName="min-h-[200px] overflow-auto"
    >
      {transactions.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted">{emptyLabel}</p>
      ) : (
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/60 text-[11px] uppercase tracking-wider text-muted">
              <th className="px-4 py-2 font-medium">{columns.user}</th>
              <th className="px-4 py-2 font-medium">{columns.amount}</th>
              <th className="px-4 py-2 font-medium">{columns.coin}</th>
              <th className="px-4 py-2 font-medium">{columns.type}</th>
              <th className="px-4 py-2 font-medium">{columns.time}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {transactions.map((tx) => (
              <tr key={tx.id} className="transition hover:bg-surface-elevated/50">
                <td className="max-w-[120px] truncate px-4 py-2 font-medium text-foreground">
                  {tx.username}
                </td>
                <td
                  className={`px-4 py-2 font-mono text-xs tabular-nums ${
                    tx.st === 1 ? "text-success" : tx.st === 2 ? "text-danger" : "text-foreground"
                  }`}
                >
                  {tx.st === 2 ? "−" : "+"}
                  {tx.num}
                </td>
                <td className="px-4 py-2 text-xs uppercase text-muted">{tx.coinname}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      tx.st === 1
                        ? "bg-success/15 text-success"
                        : tx.st === 2
                          ? "bg-danger/15 text-danger"
                          : "bg-white/5 text-muted"
                    }`}
                  >
                    {billStLabel(translate, tx.st)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-xs text-muted">
                  {formatTimestamp(tx.addtime)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardCard>
  );
}
