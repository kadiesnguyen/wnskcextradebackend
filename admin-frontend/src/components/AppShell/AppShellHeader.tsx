"use client";

import Link from "next/link";
import { useLogout } from "@/features/auth/useAuth";
import type { AdminUser } from "@/features/auth/types";
import { useI18n } from "@/lib/i18n/useI18n";
import type { Locale } from "@/lib/i18n/types";

type AppShellHeaderProps = {
  user: AdminUser;
};

export function AppShellHeader({ user }: AppShellHeaderProps) {
  const logout = useLogout();
  const { t, locale, setLocale } = useI18n();
  const displayName = user.name ?? user.username;

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 md:px-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted">{t("auth.signedInAs")}</p>
        <p className="text-sm font-medium text-foreground">{displayName}</p>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted">
          <span className="sr-only">{t("common.language")}</span>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            className="rounded border border-border bg-surface-elevated px-2 py-1 text-sm text-foreground"
          >
            <option value="vi">{t("common.locale.vi")}</option>
            <option value="en">{t("common.locale.en")}</option>
          </select>
        </label>
        <Link
          href="/account/password"
          className="rounded border border-border px-3 py-1.5 text-sm text-foreground transition hover:border-primary hover:text-primary"
        >
          {t("auth.changePassword")}
        </Link>
        <button
          type="button"
          onClick={logout}
          className="rounded border border-border px-3 py-1.5 text-sm text-foreground transition hover:border-primary hover:text-primary"
        >
          {t("auth.signOut")}
        </button>
      </div>
    </header>
  );
}
