"use client";

import { PageHeader } from "@/components/list/ListPageParts";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ErrorState } from "@/components/ui/ErrorState";
import { useI18n } from "@/lib/i18n/useI18n";
import { useState } from "react";
import { ContractQueuePanel } from "./ContractQueuePanel";
import { ContractQueuePanelSkeleton } from "./ContractQueuePanelSkeleton";
import { useContractQueue } from "./useContractQueue";
import { useContractQueueActions } from "./useContractQueueActions";
import type { QueueAction } from "./types";

export function ContractQueuePanelContainer() {
  const { t } = useI18n();
  const [pendingAction, setPendingAction] = useState<QueueAction | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useContractQueue();
  const { action } = useContractQueueActions();

  const dialogMeta = pendingAction
    ? {
        next_win: {
          title: t("page.queue.confirm.nextWinTitle"),
          message: t("page.queue.confirm.nextWinMessage"),
          variant: "default" as const,
        },
        next_loss: {
          title: t("page.queue.confirm.nextLossTitle"),
          message: t("page.queue.confirm.nextLossMessage"),
          variant: "danger" as const,
        },
        add_win: {
          title: t("page.queue.confirm.addWinTitle"),
          message: t("page.queue.confirm.addWinMessage"),
          variant: "default" as const,
        },
        add_loss: {
          title: t("page.queue.confirm.addLossTitle"),
          message: t("page.queue.confirm.addLossMessage"),
          variant: "danger" as const,
        },
      }[pendingAction]
    : null;

  const handleConfirm = async () => {
    if (!pendingAction) return;

    setActionError(null);
    try {
      await action.mutateAsync(pendingAction);
      setPendingAction(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t("common.actionFailed"));
    }
  };

  const entries = data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader titleKey="page.queue.title" descriptionKey="page.queue.description" />

      <section
        aria-label={t("page.queue.actions")}
        className="rounded-lg border border-border bg-surface p-4"
      >
        <h2 className="text-sm font-medium text-foreground">{t("page.queue.actions")}</h2>
        <p className="mt-1 text-xs text-muted">{t("page.queue.actionsHint")}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={action.isPending}
            onClick={() => {
              setActionError(null);
              setPendingAction("next_win");
            }}
            className="rounded bg-success px-3 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-40"
          >
            {t("page.queue.nextWin")}
          </button>
          <button
            type="button"
            disabled={action.isPending}
            onClick={() => {
              setActionError(null);
              setPendingAction("next_loss");
            }}
            className="rounded bg-danger px-3 py-2 text-sm font-medium text-foreground transition hover:opacity-90 disabled:opacity-40"
          >
            {t("page.queue.nextLoss")}
          </button>
          <button
            type="button"
            disabled={action.isPending}
            onClick={() => {
              setActionError(null);
              setPendingAction("add_win");
            }}
            className="rounded border border-success px-3 py-2 text-sm font-medium text-success transition hover:bg-success/10 disabled:opacity-40"
          >
            {t("page.queue.addWin")}
          </button>
          <button
            type="button"
            disabled={action.isPending}
            onClick={() => {
              setActionError(null);
              setPendingAction("add_loss");
            }}
            className="rounded border border-danger px-3 py-2 text-sm font-medium text-danger transition hover:bg-danger/10 disabled:opacity-40"
          >
            {t("page.queue.addLoss")}
          </button>
        </div>
      </section>

      {actionError ? (
        <div role="alert" className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {actionError}
        </div>
      ) : null}

      {isLoading ? <ContractQueuePanelSkeleton /> : null}

      {isError ? (
        <ErrorState
          message={error instanceof Error ? error.message : t("page.queue.loadFailed")}
          retry={() => refetch()}
        />
      ) : null}

      {!isLoading && !isError ? (
        <>
          <div className="flex items-center justify-between text-sm text-muted">
            <p>{t("page.queue.entryCount", { count: String(entries.length) })}</p>
            {isFetching ? <span className="text-primary">{t("common.updating")}</span> : null}
          </div>

          {entries.length === 0 ? (
            <div role="status" className="rounded-lg border border-border bg-surface px-6 py-12 text-center">
              <h2 className="text-sm font-medium text-foreground">{t("page.queue.emptyTitle")}</h2>
              <p className="mt-1 text-sm text-muted">{t("page.queue.emptyHint")}</p>
            </div>
          ) : (
            <ContractQueuePanel entries={entries} />
          )}
        </>
      ) : null}

      <ConfirmDialog
        isOpen={pendingAction !== null}
        title={dialogMeta?.title ?? t("common.confirm")}
        message={dialogMeta?.message ?? ""}
        confirmLabel={t("common.confirm")}
        variant={dialogMeta?.variant ?? "default"}
        isPending={action.isPending}
        onConfirm={handleConfirm}
        onCancel={() => {
          if (!action.isPending) {
            setPendingAction(null);
          }
        }}
      />
    </div>
  );
}
