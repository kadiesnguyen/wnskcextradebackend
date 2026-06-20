type KpiCardProps = {
  label: string;
  value: string;
  sublabel?: string;
  accent?: "gold" | "green" | "blue" | "red" | "neutral";
};

const accentStyles = {
  gold: "from-primary/20 to-transparent text-primary",
  green: "from-success/20 to-transparent text-success",
  blue: "from-sky-500/20 to-transparent text-sky-400",
  red: "from-danger/20 to-transparent text-danger",
  neutral: "from-white/5 to-transparent text-foreground",
} as const;

export function KpiCard({ label, value, sublabel, accent = "neutral" }: KpiCardProps) {
  return (
    <article className="relative overflow-hidden rounded-xl border border-border bg-surface px-4 py-3">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentStyles[accent]}`}
        aria-hidden
      />
      <div className="relative">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">{label}</p>
        <p className="mt-1 truncate text-xl font-semibold tabular-nums text-foreground">{value}</p>
        {sublabel ? <p className="mt-0.5 text-[11px] text-muted">{sublabel}</p> : null}
      </div>
    </article>
  );
}
