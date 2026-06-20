"use client";
import { useMemo, useState } from "react";
import { ActionButton, RowActions, ToolbarActions, useRowSelection } from "@/components/actions";
import { ActionsCell, DataTable, EmptyState, PageHeader, PageMetaBar, PaginationNav, RowCheckbox, actionsColumn } from "@/components/list/ListPageParts";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ErrorState } from "@/components/ui/ErrorState";
import { useI18n } from "@/lib/i18n/useI18n";
import { useUrlParams } from "@/hooks/useUrlParams";
import { AdminFormDialog } from "./AdminFormDialog";
import { AdminListSkeleton } from "./AdminListSkeleton";
import { useAdmin, useAdminActions, useAdmins } from "./useAdmins";
import type { AdminAccount, AdminUpsertPayload } from "./types";

export function AdminListContainer() {
  const { t } = useI18n();
  const { page, updateParams } = useUrlParams();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingBulk, setPendingBulk] = useState<"forbid" | "resume" | "delete" | null>(null);
  const queryParams = useMemo(() => ({ page: page > 0 ? page : 1, per_page: 15 }), [page]);
  const { data, isLoading, isError, error, refetch, isFetching } = useAdmins(queryParams);
  const { data: detail } = useAdmin(formOpen ? editingId : null);
  const { create, update, updateStatus } = useAdminActions();
  const items = data?.data ?? [];
  const meta = data?.meta;
  const editing = editingId ? (detail?.data ?? null) : null;
  const selection = useRowSelection(items);
  const handleSubmit = async (payload: AdminUpsertPayload) => {
    setFormError(null);
    try {
      if (editingId) await update.mutateAsync({ id: editingId, payload });
      else await create.mutateAsync(payload);
      setFormOpen(false); setEditingId(null);
    } catch (err) { setFormError(err instanceof Error ? err.message : t("common.saveFailed")); }
  };
  const columns = [{ key: "id", label: t("common.id") }, { key: "username", label: t("common.username") }, { key: "email", label: t("common.email") }, { key: "nickname", label: t("common.nickname") }, actionsColumn(t)];
  return (
    <div className="space-y-6">
      <PageHeader titleKey="page.admins.title" descriptionKey="page.admins.description" action={
        <ToolbarActions>
          <ActionButton variant="primary" onClick={() => { setEditingId(null); setFormOpen(true); }}>{t("page.admins.create")}</ActionButton>
          <ActionButton variant="success" disabled={selection.selectedIds.length === 0} onClick={() => setPendingBulk("resume")}>{t("action.resume")}</ActionButton>
          <ActionButton variant="warning" disabled={selection.selectedIds.length === 0} onClick={() => setPendingBulk("forbid")}>{t("action.suspend")}</ActionButton>
          <ActionButton variant="danger" disabled={selection.selectedIds.length === 0} onClick={() => setPendingBulk("delete")}>{t("common.delete")}</ActionButton>
        </ToolbarActions>
      } />
      {isLoading ? <AdminListSkeleton /> : null}
      {isError ? <ErrorState message={error instanceof Error ? error.message : t("common.loadFailed")} retry={() => refetch()} /> : null}
      {!isLoading && !isError && items.length === 0 ? <EmptyState titleKey="page.admins.noResults" descriptionKey="common.noResultsHint" /> : null}
      {!isLoading && !isError && items.length > 0 ? (
        <>
          <PageMetaBar meta={meta} isFetching={isFetching} />
          <DataTable columns={columns} selectable allSelected={selection.allSelected} someSelected={selection.someSelected} onToggleAll={selection.toggleAll}>
            {items.map((item: AdminAccount) => (
              <tr key={item.id}>
                <td className="px-4 py-3"><RowCheckbox checked={selection.isSelected(item.id)} onChange={() => selection.toggleOne(item.id)} /></td>
                <td className="px-4 py-3">{item.id}</td>
                <td className="px-4 py-3">{item.username}</td>
                <td className="px-4 py-3">{item.email}</td>
                <td className="px-4 py-3">{item.nickname}</td>
                <ActionsCell><RowActions><ActionButton onClick={() => { setEditingId(item.id); setFormOpen(true); }}>{t("common.edit")}</ActionButton></RowActions></ActionsCell>
              </tr>
            ))}
          </DataTable>
          {meta ? <PaginationNav meta={meta} onPageChange={(p) => updateParams({ page: String(p) })} isFetching={isFetching} /> : null}
        </>
      ) : null}
      <AdminFormDialog isOpen={formOpen} editing={editing} isPending={create.isPending || update.isPending} error={formError} onSubmit={handleSubmit} onClose={() => { if (!create.isPending && !update.isPending) { setFormOpen(false); setEditingId(null); } }} />
      <ConfirmDialog isOpen={pendingBulk !== null} title={t("common.confirm")} message={pendingBulk ? `Apply ${pendingBulk} to ${selection.selectedIds.length} admin(s)?` : ""} confirmLabel={t("common.confirm")} variant={pendingBulk === "delete" ? "danger" : "default"} isPending={updateStatus.isPending} onConfirm={async () => { if (pendingBulk) { await updateStatus.mutateAsync({ ids: selection.selectedIds, type: pendingBulk }); selection.clearSelection(); setPendingBulk(null); } }} onCancel={() => { if (!updateStatus.isPending) setPendingBulk(null); }} />
    </div>
  );
}
