"use client";

import { useI18n } from "@/lib/i18n/useI18n";
import type { PaginatedMeta } from "@/lib/types/api";

type PageHeaderProps = {
  titleKey: string;
  descriptionKey?: string;
  action?: React.ReactNode;
};

export function PageHeader({ titleKey, descriptionKey, action }: PageHeaderProps) {
  const { t } = useI18n();

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t(titleKey)}</h1>
        {descriptionKey ? (
          <p className="mt-1 text-sm text-muted">{t(descriptionKey)}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}

type PaginationNavProps = {
  meta: PaginatedMeta;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
};

export function PaginationNav({ meta, onPageChange, isFetching }: PaginationNavProps) {
  const { t } = useI18n();

  if (meta.last_page <= 1) {
    return null;
  }

  return (
    <nav aria-label={t("common.pagination")} className="flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={meta.current_page <= 1}
        onClick={() => onPageChange(meta.current_page - 1)}
        className="rounded border border-border px-3 py-1.5 text-sm text-foreground transition hover:bg-surface-elevated disabled:opacity-40"
      >
        {t("common.previous")}
      </button>
      <span className="px-2 text-sm text-muted">
        {meta.current_page} / {meta.last_page}
      </span>
      <button
        type="button"
        disabled={meta.current_page >= meta.last_page}
        onClick={() => onPageChange(meta.current_page + 1)}
        className="rounded border border-border px-3 py-1.5 text-sm text-foreground transition hover:bg-surface-elevated disabled:opacity-40"
      >
        {t("common.next")}
      </button>
      {isFetching ? <span className="ml-2 text-sm text-primary">{t("common.updating")}</span> : null}
    </nav>
  );
}

type PageMetaBarProps = {
  meta?: PaginatedMeta;
  isFetching?: boolean;
};

export function PageMetaBar({ meta, isFetching }: PageMetaBarProps) {
  const { t } = useI18n();

  if (!meta) {
    return null;
  }

  return (
    <div className="flex items-center justify-between text-sm text-muted">
      <p>
        {t("common.pageInfo", {
          current: String(meta.current_page),
          last: String(meta.last_page),
          total: String(meta.total),
        })}
        {isFetching ? <span className="ml-2 text-primary">{t("common.updating")}</span> : null}
      </p>
    </div>
  );
}

type EmptyStateProps = {
  titleKey: string;
  descriptionKey?: string;
  action?: React.ReactNode;
};

export function EmptyState({ titleKey, descriptionKey, action }: EmptyStateProps) {
  const { t } = useI18n();

  return (
    <div role="status" className="rounded-lg border border-border bg-surface px-6 py-12 text-center">
      <h2 className="text-sm font-medium text-foreground">{t(titleKey)}</h2>
      {descriptionKey ? <p className="mt-1 text-sm text-muted">{t(descriptionKey)}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="animate-pulse">
        <div className="grid gap-px bg-border" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, i) => (
            <div key={`h-${i}`} className="h-10 bg-surface-elevated" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, row) => (
          <div
            key={`r-${row}`}
            className="grid gap-px bg-border"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {Array.from({ length: cols }).map((_, col) => (
              <div key={`c-${row}-${col}`} className="h-12 bg-surface" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export type DataTableColumn = {
  key: string;
  label: string;
  className?: string;
};

type DataTableProps = {
  columns: DataTableColumn[];
  children: React.ReactNode;
  selectable?: boolean;
  allSelected?: boolean;
  someSelected?: boolean;
  onToggleAll?: () => void;
};

export function checkboxColumn(t: (key: string) => string): DataTableColumn {
  return { key: "_select", label: "", className: "w-10" };
}

export function actionsColumn(t: (key: string) => string): DataTableColumn {
  return { key: "actions", label: t("common.actions"), className: "whitespace-nowrap" };
}

type RowCheckboxProps = {
  checked: boolean;
  onChange: () => void;
  label?: string;
};

export function RowCheckbox({ checked, onChange, label }: RowCheckboxProps) {
  const { t } = useI18n();

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={label ?? t("common.selectRow")}
      className="rounded border-border"
    />
  );
}

export function DataTable({
  columns,
  children,
  selectable,
  allSelected,
  someSelected,
  onToggleAll,
}: DataTableProps) {
  const { t } = useI18n();

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-surface-elevated">
          <tr>
            {selectable ? (
              <th scope="col" className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = Boolean(someSelected);
                  }}
                  onChange={onToggleAll}
                  aria-label={t("common.selectAll")}
                  className="rounded border-border"
                />
              </th>
            ) : null}
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-4 py-3 text-left font-medium text-muted ${col.className ?? ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">{children}</tbody>
      </table>
    </div>
  );
}

type ActionsCellProps = {
  children: React.ReactNode;
};

export function ActionsCell({ children }: ActionsCellProps) {
  return <td className="px-4 py-3">{children}</td>;
}

type UsernameFilterProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function UsernameFilter({ value, onChange, onSubmit }: UsernameFilterProps) {
  const { t } = useI18n();

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-end"
      role="search"
    >
      <div className="flex-1">
        <label htmlFor="username-filter" className="block text-sm font-medium text-foreground">
          {t("common.username")}
        </label>
        <input
          id="username-filter"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("common.searchByUsername")}
          className="mt-1 w-full rounded border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground placeholder:text-muted"
        />
      </div>
      <button
        type="submit"
        className="rounded bg-primary px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
      >
        {t("common.search")}
      </button>
    </form>
  );
}
