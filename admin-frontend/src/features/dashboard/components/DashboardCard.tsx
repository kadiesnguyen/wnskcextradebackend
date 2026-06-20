import type { ReactNode } from "react";
import Link from "next/link";

type DashboardCardProps = {
  title: string;
  action?: { label: string; href: string };
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function DashboardCard({
  title,
  action,
  children,
  className = "",
  bodyClassName = "",
}: DashboardCardProps) {
  return (
    <section
      className={`flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-surface ${className}`}
    >
      <header className="flex shrink-0 items-center justify-between border-b border-border/60 px-4 py-2.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{title}</h3>
        {action ? (
          <Link
            href={action.href}
            className="text-xs font-medium text-primary transition hover:text-foreground"
          >
            {action.label}
          </Link>
        ) : null}
      </header>
      <div className={`min-h-0 flex-1 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
