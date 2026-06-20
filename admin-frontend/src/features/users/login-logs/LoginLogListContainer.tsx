"use client";
import { useMemo, useState } from "react";
import { ActionButton, RowActions, ToolbarActions, useRowSelection } from "@/components/actions";
import { DataTableCell, ActionsCell, DataTable, EmptyState, PageHeader, PageMetaBar, PaginationNav, RowCheckbox, UsernameFilter, actionsColumn } from "@/components/list/ListPageParts"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ErrorState } from "@/components/ui/ErrorState";
import { loginLogStatusLabel } from "@/lib/i18n/entity-labels";
import { useI18n } from "@/lib/i18n/useI18n";
import { useUrlParams } from "@/hooks/useUrlParams";
import { LoginLogListSkeleton } from "./LoginLogListSkeleton";
import { useLoginLogActions } from "./useLoginLogActions";
import { useLoginLogs } from "./useLoginLogs";
import type { LoginLog } from "./types";

export function LoginLogListContainer() {
  const { t } = useI18n();
  const { page, updateParams, getParam } = useUrlParams();
  const username = getParam("username");
  const [usernameInput, setUsernameInput] = useState(username);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<LoginLog | null>(null);
  const [remark, setRemark] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingBulk, setPendingBulk] = useState<"resume" | "forbid" | "del" | null>(null);
  const queryParams = useMemo(() => ({ page: page > 0 ? page : 1, per_page: 15, username: username || undefined }), [page, username]);
  const { data, isLoading, isError, error, refetch, isFetching } = useLoginLogs(queryParams);
  const { update, updateStatus } = useLoginLogActions();
  const items = data?.data ?? [];
  const meta = data?.meta;
  const selection = useRowSelection(items);

  const columns = [
    { key: "id", label: t("common.id") },
    { key: "username", label: t("common.username") },
    { key: "type", label: t("common.type") },
    { key: "addip", label: "IP" },
    { key: "status", label: t("common.status") },
    { key: "addtime", label: t("common.time") },
    actionsColumn(t),
  ];

  return (
    <div className="space-y-6">
      <PageHeader titleKey="page.loginLogs.title" descriptionKey="page.loginLogs.description" action={
        <ToolbarActions>
          <ActionButton variant="primary" onClick={() => { setEditing(null); setRemark(""); setFormOpen(true); }}>{t("action.add")}</ActionButton>
          <ActionButton variant="success" disabled={selection.selectedIds.length === 0} onClick={() => setPendingBulk("resume")}>{t("action.resume")}</ActionButton>
          <ActionButton variant="warning" disabled={selection.selectedIds.length === 0} onClick={() => setPendingBulk("forbid")}>{t("action.suspend")}</ActionButton>
          <ActionButton variant="danger" disabled={selection.selectedIds.length === 0} onClick={() => setPendingBulk("del")}>{t("common.delete")}</ActionButton>
        </ToolbarActions>
      } />
      <UsernameFilter value={usernameInput} onChange={setUsernameInput} onSubmit={(e) => { e.preventDefault(); updateParams({ username: usernameInput.trim() || null, page: "1" }); }} />
      {isLoading ? <LoginLogListSkeleton /> : null}
      {isError ? <ErrorState message={error instanceof Error ? error.message : t("common.loadFailed")} retry={() => refetch()} /> : null}
      {!isLoading && !isError && items.length === 0 ? <EmptyState titleKey="page.loginLogs.noResults" descriptionKey="common.noResultsHint" /> : null}
      {!isLoading && !isError && items.length > 0 ? (
        <>
          <PageMetaBar meta={meta} isFetching={isFetching} />
          <DataTable columns={columns} selectable allSelected={selection.allSelected} someSelected={selection.someSelected} onToggleAll={selection.toggleAll}>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3"><RowCheckbox checked={selection.isSelected(item.id)} onChange={() => selection.toggleOne(item.id)} /></td>
                <DataTableCell columnKey="id">{item.id}</DataTableCell>
                <DataTableCell columnKey="username">{item.username ?? "—"}</DataTableCell>
                <td className="px-4 py-3">{item.type ?? "—"}</td>
                <td className="px-4 py-3">{item.addip ?? "—"}</td>
                <td className="px-4 py-3">{loginLogStatusLabel(t, item.status)}</td>
                <td className="px-4 py-3">{item.addtime}</td>
                <ActionsCell><RowActions><ActionButton onClick={() => { setEditing(item); setRemark(item.remark ?? ""); setFormOpen(true); }}>{t("common.edit")}</ActionButton></RowActions></ActionsCell>
              </tr>
            ))}
          </DataTable>
          {meta ? <PaginationNav meta={meta} onPageChange={(p) => updateParams({ page: String(p) })} isFetching={isFetching} /> : null}
        </>
      ) : null}
      {formOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={async (e) => { e.preventDefault(); if (!editing) return; setFormError(null); try { await update.mutateAsync({ id: editing.id, payload: { remark } }); setFormOpen(false); } catch (err) { setFormError(err instanceof Error ? err.message : t("common.saveFailed")); } }} className="w-full max-w-md space-y-4 rounded-lg border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold">{t("common.edit")}</h2>
            {formError ? <p className="text-sm text-danger">{formError}</p> : null}
            <textarea rows={3} value={remark} onChange={(e) => setRemark(e.target.value)} placeholder={t("common.remark")} className="w-full rounded border border-border bg-surface-elevated px-3 py-2 text-sm" />
            <div className="flex justify-end gap-2"><ActionButton variant="ghost" type="button" onClick={() => setFormOpen(false)}>{t("common.cancel")}</ActionButton><ActionButton variant="primary" type="submit" disabled={update.isPending}>{t("common.save")}</ActionButton></div>
          </form>
        </div>
      ) : null}
      <ConfirmDialog isOpen={pendingBulk !== null} title={t("common.confirm")} message={pendingBulk ? `Apply ${pendingBulk} to ${selection.selectedIds.length} log(s)?` : ""} confirmLabel={t("common.confirm")} variant={pendingBulk === "del" ? "danger" : "default"} isPending={updateStatus.isPending} onConfirm={async () => { if (!pendingBulk) return; await updateStatus.mutateAsync({ ids: selection.selectedIds, type: pendingBulk }); selection.clearSelection(); setPendingBulk(null); }} onCancel={() => { if (!updateStatus.isPending) setPendingBulk(null); }} />
    </div>
  );
}
