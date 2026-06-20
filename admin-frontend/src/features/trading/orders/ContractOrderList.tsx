"use client";

import {
  contractHyzdLabel,
  contractKongykLabel,
  contractStatusLabel,
} from "@/lib/i18n/entity-labels";
import { useI18n } from "@/lib/i18n/useI18n";
import { formatTimestamp, kongykStatusClass } from "../lib/format";
import type { ContractOrder } from "./types";

type ContractOrderListProps = {
  orders: ContractOrder[];
  pendingActionId: number | null;
  onSetWinLoss: (order: ContractOrder, kongyk: 0 | 1 | 2) => void;
  onSettle: (order: ContractOrder) => void;
};

export function ContractOrderList({
  orders,
  pendingActionId,
  onSetWinLoss,
  onSettle,
}: ContractOrderListProps) {
  const { t } = useI18n();

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-border bg-surface-elevated text-xs uppercase tracking-wide text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              {t("common.id")}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t("common.username")}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t("common.coin")}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t("common.amount")}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t("common.direction")}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t("common.control")}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t("common.status")}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t("common.buyTime")}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t("common.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((order) => {
            const isBusy = pendingActionId === order.id;

            return (
              <tr key={order.id} className="bg-surface transition hover:bg-surface-elevated">
                <td className="px-4 py-3 text-muted">{order.id}</td>
                <td className="px-4 py-3 font-medium text-foreground">{order.username}</td>
                <td className="px-4 py-3 uppercase text-foreground">{order.coinname}</td>
                <td className="px-4 py-3 text-foreground">{order.num}</td>
                <td className="px-4 py-3 text-muted">{contractHyzdLabel(t, order.hyzd)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${kongykStatusClass(order.kongyk)}`}
                  >
                    {contractKongykLabel(t, order.kongyk)}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{contractStatusLabel(t, order.status)}</td>
                <td className="px-4 py-3 text-muted">{formatTimestamp(order.buytime)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onSetWinLoss(order, 1)}
                      className="rounded bg-success px-2.5 py-1 text-xs font-medium text-background transition hover:opacity-90 disabled:opacity-40"
                    >
                      {t("action.win")}
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onSetWinLoss(order, 2)}
                      className="rounded border border-danger px-2.5 py-1 text-xs font-medium text-danger transition hover:bg-danger/10 disabled:opacity-40"
                    >
                      {t("action.loss")}
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onSetWinLoss(order, 0)}
                      className="rounded border border-border px-2.5 py-1 text-xs font-medium text-muted transition hover:bg-surface-elevated disabled:opacity-40"
                    >
                      {t("action.normal")}
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onSettle(order)}
                      className="rounded bg-primary px-2.5 py-1 text-xs font-medium text-background transition hover:opacity-90 disabled:opacity-40"
                    >
                      {t("action.settleOrder")}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
