"use client";
import { useMemo, useState } from "react";
import { ErrorState } from "@/components/ui/ErrorState";
import { DataTable, EmptyState, PageHeader, PageMetaBar, PaginationNav, UsernameFilter } from "@/components/list/ListPageParts";
import { useI18n } from "@/lib/i18n/useI18n";
import { useUrlParams } from "@/hooks/useUrlParams";
import { SpotMarketListSkeleton } from "./SpotMarketListSkeleton";
import { useSpotMarket } from "./useSpot";

export function SpotMarketListContainer() {
  const { t } = useI18n();
  const { page, updateParams, getParam } = useUrlParams();
  const username = getParam("username");
  const [usernameInput, setUsernameInput] = useState(username);
  const queryParams = useMemo(() => ({ page: page > 0 ? page : 1, per_page: 15, username: username || undefined }), [page, username]);
  const { data, isLoading, isError, error, refetch, isFetching } = useSpotMarket(queryParams);
  const items = data?.data ?? [];
  const meta = data?.meta;
  const columns = [{ key: "id", label: t("common.id") }, { key: "account", label: t("common.username") }, { key: "symbol", label: t("common.symbol") }, { key: "coinnum", label: t("common.amount") }, { key: "status_label", label: t("common.status") }, { key: "addtime", label: t("common.time") }];
  return (
    <div className="space-y-6">
      <PageHeader titleKey="page.spotMarket.title" descriptionKey="page.spotMarket.description" />
      <UsernameFilter value={usernameInput} onChange={setUsernameInput} onSubmit={(e) => { e.preventDefault(); updateParams({ username: usernameInput.trim() || null, page: "1" }); }} />
      {isLoading ? <SpotMarketListSkeleton /> : null}
      {isError ? <ErrorState message={error instanceof Error ? error.message : t("common.loadFailed")} retry={() => refetch()} /> : null}
      {!isLoading && !isError && items.length === 0 ? <EmptyState titleKey="page.spotMarket.noResults" descriptionKey="common.noResultsHint" /> : null}
      {!isLoading && !isError && items.length > 0 ? (
        <>
          <PageMetaBar meta={meta} isFetching={isFetching} />
          <DataTable columns={columns}>{items.map((item) => (<tr key={item.id}><td className="px-4 py-3">{item.id}</td><td className="px-4 py-3">{item.account}</td><td className="px-4 py-3">{item.symbol}</td><td className="px-4 py-3">{item.coinnum}</td><td className="px-4 py-3">{item.status_label}</td><td className="px-4 py-3">{item.addtime}</td></tr>))}</DataTable>
          {meta ? <PaginationNav meta={meta} onPageChange={(p) => updateParams({ page: String(p) })} isFetching={isFetching} /> : null}
        </>
      ) : null}
    </div>
  );
}
