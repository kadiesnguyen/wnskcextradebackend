"use client";

import { queueResultLabel } from "@/lib/i18n/entity-labels";
import { useI18n } from "@/lib/i18n/useI18n";
import { queueResultClass } from "../lib/format";
import type { QueueEntry } from "./types";

type ContractQueuePanelProps = {
  entries: QueueEntry[];
};

export function ContractQueuePanel({ entries }: ContractQueuePanelProps) {
  const { t } = useI18n();

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-border bg-surface-elevated text-xs uppercase tracking-wide text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              {t("common.round")}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t("common.result")}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t("common.added")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {entries.map((entry) => (
            <tr key={entry.id} className="bg-surface transition hover:bg-surface-elevated">
              <td className="px-4 py-3 text-foreground">{entry.round_no}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${queueResultClass(entry.result)}`}
                >
                  {queueResultLabel(t, entry.result)}
                </span>
              </td>
              <td className="px-4 py-3 text-muted">{entry.addtime_text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
