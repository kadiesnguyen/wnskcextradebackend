import { formatTimestamp } from "@/features/finance/lib/format";
import type { AdminStakingLog } from "./types";

type StakingLogListProps = {
  logs: AdminStakingLog[];
};

function statusClass(status: number): string {
  return status === 1 ? "bg-primary/15 text-primary" : "bg-success/15 text-success";
}

export function StakingLogList({ logs }: StakingLogListProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-border bg-surface-elevated text-xs uppercase tracking-wide text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              ID
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Account
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Package
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Amount
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Days
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Rate
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Started
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Ends
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {logs.map((log) => (
            <tr key={log.id} className="bg-surface transition hover:bg-surface-elevated">
              <td className="px-4 py-3 text-muted">{log.id}</td>
              <td className="px-4 py-3 font-medium text-foreground">{log.account}</td>
              <td className="px-4 py-3 text-foreground">{log.name}</td>
              <td className="px-4 py-3 text-foreground">{log.num}</td>
              <td className="px-4 py-3 text-muted">{log.open}</td>
              <td className="px-4 py-3 text-foreground">{log.percent}%</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${statusClass(log.status)}`}
                >
                  {log.status_label}
                </span>
              </td>
              <td className="px-4 py-3 text-muted">{formatTimestamp(log.addtime)}</td>
              <td className="px-4 py-3 text-muted">{formatTimestamp(log.endtime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
