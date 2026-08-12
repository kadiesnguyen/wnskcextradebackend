"use client";

import { useMemo, useState } from "react";
import { ActionButton, RowActions } from "@/components/actions";
import { ErrorState } from "@/components/ui/ErrorState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  ActionsCell,
  DataTableCell,
  DataTable,
  EmptyState,
  PageHeader,
  PageMetaBar,
  PaginationNav,
  UsernameFilter,
  actionsColumn,
} from "@/components/list/ListPageParts";
import { contractIsWinLabel, contractStatusLabel } from "@/lib/i18n/entity-labels";
import { formatAmount } from "@/lib/format-number";
import { useI18n } from "@/lib/i18n/useI18n";
import { useUrlParams } from "@/hooks/useUrlParams";
import { CloseHistorySkeleton } from "./CloseHistorySkeleton";
import { useCloseHistory } from "./useCloseHistory";
import { useCloseHistoryActions } from "./useCloseHistoryActions";
import type { ContractOrder } from "./types";

type PendingFlip = {
  order: ContractOrder;
  kongyk: 1 | 2;
};

function formatDateTime(value?: string | null): string {
  if (!value) return "-";
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(normalized.endsWith("Z") ? normalized : `${normalized}Z`);
  if (Number.isNaN(date.getTime())) return value.replace("T", " ").replace(".000000Z", "");
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function profitLossClass(value: number | null | undefined): string {
  if (value == null) return "text-muted";
  if (value > 0) return "text-success";
  if (value < 0) return "text-danger";
  return "text-muted";
}

function dashAmount(value: number | null | undefined): string {
  return value != null ? formatAmount(value) : "-";
}

export function CloseHistoryContainer() {
  const { t } = useI18n();
  const { page, updateParams, getParam } = useUrlParams();
  const username = getParam("username");
  const [usernameInput, setUsernameInput] = useState(username);
  const [pendingFlip, setPendingFlip] = useState<PendingFlip | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const queryParams = useMemo(
    () => ({ page: page > 0 ? page : 1, per_page: 15, username: username || undefined }),
    [page, username],
  );
  const { data, isLoading, isError, error, refetch, isFetching } = useCloseHistory(queryParams);
  const { flipResult } = useCloseHistoryActions();
  const items = data?.data ?? [];
  const meta = data?.meta;
  const columns = [
    { key: "username", label: t("common.username"), className: "w-[14%]" },
    { key: "coinname", label: t("common.coin"), className: "w-[7%]" },
    { key: "num", label: t("common.amount"), className: "w-[8%]" },
    { key: "balance_before", label: t("page.closeHistory.balanceBefore"), className: "w-[11%]" },
    { key: "balance_after", label: t("page.closeHistory.balanceAfter"), className: "w-[11%]" },
    { key: "profit_loss", label: t("page.closeHistory.profitLoss"), className: "w-[9%]" },
    { key: "status_label", label: t("common.status"), className: "w-[16%]" },
    actionsColumn(t),
  ];

  const toWin = pendingFlip?.kongyk === 1;

  const handleConfirm = async () => {
    if (!pendingFlip) return;
    setActionError(null);
    setActionSuccess(null);
    try {
      await flipResult.mutateAsync({
        id: pendingFlip.order.id,
        kongyk: pendingFlip.kongyk,
      });
      setActionSuccess(
        t(
          toWin
            ? "page.closeHistory.convertToWinSuccess"
            : "page.closeHistory.convertToLossSuccess",
          {
            id: String(pendingFlip.order.id),
            username: pendingFlip.order.username,
          },
        ),
      );
      setPendingFlip(null);
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : t(
              toWin
                ? "page.closeHistory.convertToWinFailed"
                : "page.closeHistory.convertToLossFailed",
            ),
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader titleKey="page.closeHistory.title" descriptionKey="page.closeHistory.description" />
      <UsernameFilter
        value={usernameInput}
        onChange={setUsernameInput}
        onSubmit={(e) => {
          e.preventDefault();
          updateParams({ username: usernameInput.trim() || null, page: "1" });
        }}
      />
      {actionSuccess ? (
        <div role="status" className="rounded-lg border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
          {actionSuccess}
        </div>
      ) : null}
      {actionError ? (
        <div role="alert" className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {actionError}
        </div>
      ) : null}
      {isLoading ? <CloseHistorySkeleton /> : null}
      {isError ? (
        <ErrorState
          message={error instanceof Error ? error.message : t("common.loadFailed")}
          retry={() => refetch()}
        />
      ) : null}
      {!isLoading && !isError && items.length === 0 ? (
        <EmptyState titleKey="page.closeHistory.noResults" descriptionKey="common.noResultsHint" />
      ) : null}
      {!isLoading && !isError && items.length > 0 ? (
        <>
          <PageMetaBar meta={meta} isFetching={isFetching} />
          <DataTable columns={columns}>
            {items.map((item) => {
              const busy = flipResult.isPending && pendingFlip?.order.id === item.id;
              const settled = item.status === 2;
              const canToWin = settled && item.is_win === 2;
              const canToLoss = settled && item.is_win === 1;
              return (
                <tr key={item.id}>
                  <DataTableCell columnKey="username" className="break-all">
                    {item.username}
                  </DataTableCell>
                  <DataTableCell columnKey="coinname">{item.coinname?.toUpperCase()}</DataTableCell>
                  <DataTableCell columnKey="num" className="tabular-nums">
                    {formatAmount(item.num)}
                  </DataTableCell>
                  <DataTableCell columnKey="balance_before" className="tabular-nums">
                    {dashAmount(item.balance_before)}
                  </DataTableCell>
                  <DataTableCell columnKey="balance_after" className="tabular-nums">
                    {dashAmount(item.balance_after)}
                  </DataTableCell>
                  <DataTableCell
                    columnKey="profit_loss"
                    className={`tabular-nums font-medium ${profitLossClass(item.profit_loss)}`}
                  >
                    {dashAmount(item.profit_loss)}
                  </DataTableCell>
                  <DataTableCell columnKey="status_label">
                    <div className="space-y-1">
                      <div className="font-medium">{contractStatusLabel(t, item.status)}</div>
                      <div className="text-xs text-muted">{contractIsWinLabel(t, item.is_win)}</div>
                      <div className="text-xs text-muted">
                        {formatDateTime(item.selltime ?? item.buytime)}
                      </div>
                    </div>
                  </DataTableCell>
                  <ActionsCell>
                    {canToWin || canToLoss ? (
                      <RowActions>
                        {canToWin ? (
                          <ActionButton
                            variant="success"
                            disabled={busy || flipResult.isPending}
                            onClick={() => {
                              setActionError(null);
                              setPendingFlip({ order: item, kongyk: 1 });
                            }}
                          >
                            {t("action.convertToWin")}
                          </ActionButton>
                        ) : null}
                        {canToLoss ? (
                          <ActionButton
                            variant="danger"
                            disabled={busy || flipResult.isPending}
                            onClick={() => {
                              setActionError(null);
                              setPendingFlip({ order: item, kongyk: 2 });
                            }}
                          >
                            {t("action.convertToLoss")}
                          </ActionButton>
                        ) : null}
                      </RowActions>
                    ) : (
                      <span className="text-xs text-muted">-</span>
                    )}
                  </ActionsCell>
                </tr>
              );
            })}
          </DataTable>
          {meta ? (
            <PaginationNav
              meta={meta}
              onPageChange={(p) => updateParams({ page: String(p) })}
              isFetching={isFetching}
            />
          ) : null}
        </>
      ) : null}

      <ConfirmDialog
        isOpen={pendingFlip != null}
        title={t(
          toWin
            ? "page.closeHistory.convertToWinTitle"
            : "page.closeHistory.convertToLossTitle",
        )}
        message={
          pendingFlip
            ? t(
                toWin
                  ? "page.closeHistory.convertToWinMessage"
                  : "page.closeHistory.convertToLossMessage",
                {
                  id: String(pendingFlip.order.id),
                  username: pendingFlip.order.username,
                },
              )
            : ""
        }
        confirmLabel={t(toWin ? "action.convertToWin" : "action.convertToLoss")}
        variant={toWin ? "default" : "danger"}
        isPending={flipResult.isPending}
        onConfirm={() => {
          void handleConfirm();
        }}
        onCancel={() => {
          if (!flipResult.isPending) setPendingFlip(null);
        }}
      />
    </div>
  );
}
