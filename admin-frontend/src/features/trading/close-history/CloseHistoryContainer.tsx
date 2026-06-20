"use client";
import { useMemo, useState } from "react";
import { ErrorState } from "@/components/ui/ErrorState";
import { DataTableCell, DataTable, EmptyState, PageHeader, PageMetaBar, PaginationNav, UsernameFilter } from "@/components/list/ListPageParts"
import { contractStatusLabel } from "@/lib/i18n/entity-labels";
import { useI18n } from "@/lib/i18n/useI18n";
import { useUrlParams } from "@/hooks/useUrlParams";
import { CloseHistorySkeleton } from "./CloseHistorySkeleton";
import { useCloseHistory } from "./useCloseHistory";

export function CloseHistoryContainer() {
  const { t } = useI18n();
  const { page, updateParams, getParam } = useUrlParams();
  const username = getParam("username");
  const [usernameInput, setUsernameInput] = useState(username);
  const queryParams = useMemo(() => ({ page: page > 0 ? page : 1, per_page: 15, username: username || undefined }), [page, username]);
  const { data, isLoading, isError, error, refetch, isFetching } = useCloseHistory(queryParams);
  const items = data?.data ?? [];
  const meta = data?.meta;
  const columns = [
    { key: "id", label: t("common.id"), className: "w-[6%]" },
    { key: "username", label: t("common.username"), className: "w-[22%]" },
    { key: "coinname", label: t("common.coin"), className: "w-[12%]" },
    { key: "num", label: t("common.amount"), className: "w-[10%]" },
    { key: "status_label", label: t("common.status"), className: "w-[14%]" },
    { key: "buytime", label: t("common.time"), className: "w-[20%]" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader titleKey="page.closeHistory.title" descriptionKey="page.closeHistory.description" />
      <UsernameFilter value={usernameInput} onChange={setUsernameInput} onSubmit={(e) => { e.preventDefault(); updateParams({ username: usernameInput.trim() || null, page: "1" }); }} />
      {isLoading ? <CloseHistorySkeleton /> : null}
      {isError ? <ErrorState message={error instanceof Error ? error.message : t("common.loadFailed")} retry={() => refetch()} /> : null}
      {!isLoading && !isError && items.length === 0 ? <EmptyState titleKey="page.closeHistory.noResults" descriptionKey="common.noResultsHint" /> : null}
      {!isLoading && !isError && items.length > 0 ? (
        <>
          <PageMetaBar meta={meta} isFetching={isFetching} />
          <DataTable columns={columns}>
            {items.map((item) => (
              <tr key={item.id}>
                <DataTableCell columnKey="id">{item.id}</DataTableCell>
                <DataTableCell columnKey="username">{item.username}</DataTableCell>
                <DataTableCell columnKey="coinname">{item.coinname?.toUpperCase()}</DataTableCell>
                <DataTableCell columnKey="num">{item.num}</DataTableCell>
                <DataTableCell columnKey="status_label">
                  {contractStatusLabel(t, item.status)}
                </DataTableCell>
                <DataTableCell columnKey="buytime">{item.buytime ?? item.addtime ?? "—"}</DataTableCell>
              </tr>
            ))}
          </DataTable>
          {meta ? <PaginationNav meta={meta} onPageChange={(p) => updateParams({ page: String(p) })} isFetching={isFetching} /> : null}
        </>
      ) : null}
    </div>
  );
}
