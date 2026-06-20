import type { LoginLog } from "@/features/users/login-logs/types";
import { loginLogStatusLabel } from "@/lib/i18n/entity-labels";
import { useI18n } from "@/lib/i18n/useI18n";
import { formatTimestamp } from "../format";
import { DashboardCard } from "./DashboardCard";

type RecentLoginTableProps = {
  title: string;
  viewAllLabel: string;
  logins: LoginLog[];
  emptyLabel: string;
  columns: {
    user: string;
    ip: string;
    location: string;
    time: string;
    status: string;
  };
};

export function RecentLoginTable({
  title,
  viewAllLabel,
  logins,
  emptyLabel,
  columns,
}: RecentLoginTableProps) {
  const { t: translate } = useI18n();

  return (
    <DashboardCard
      title={title}
      action={{ label: viewAllLabel, href: "/users/login-logs" }}
      bodyClassName="min-h-[200px] overflow-auto"
    >
      {logins.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted">{emptyLabel}</p>
      ) : (
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/60 text-[11px] uppercase tracking-wider text-muted">
              <th className="px-4 py-2 font-medium">{columns.user}</th>
              <th className="px-4 py-2 font-medium">{columns.ip}</th>
              <th className="hidden px-4 py-2 font-medium xl:table-cell">{columns.location}</th>
              <th className="px-4 py-2 font-medium">{columns.time}</th>
              <th className="px-4 py-2 font-medium">{columns.status}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {logins.map((log) => (
              <tr key={log.id} className="transition hover:bg-surface-elevated/50">
                <td className="max-w-[120px] truncate px-4 py-2 font-medium text-foreground">
                  {log.username ?? "—"}
                </td>
                <td className="px-4 py-2 font-mono text-xs text-muted">{log.addip ?? "—"}</td>
                <td className="hidden max-w-[140px] truncate px-4 py-2 text-muted xl:table-cell">
                  {log.addr ?? "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-xs text-muted">
                  {formatTimestamp(log.addtime)}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      log.status === 1
                        ? "bg-success/15 text-success"
                        : log.status === 0
                          ? "bg-danger/15 text-danger"
                          : "bg-white/5 text-muted"
                    }`}
                  >
                    {loginLogStatusLabel(translate, log.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardCard>
  );
}
