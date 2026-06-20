export function AppShellSkeleton() {
  return (
    <div
      className="flex min-h-screen bg-background"
      aria-busy="true"
      aria-label="Loading admin dashboard"
    >
      <div className="hidden w-80 shrink-0 border-r border-border bg-surface p-4 md:block">
        <div className="skeleton mb-4 h-6 w-24" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="skeleton h-8 w-full" />
          ))}
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 md:px-6">
          <div className="skeleton h-8 w-32" />
          <div className="skeleton h-8 w-20" />
        </div>
        <div className="flex-1 space-y-4 p-4 md:p-6">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-32 w-full" />
          <div className="skeleton h-32 w-full" />
        </div>
      </div>
    </div>
  );
}
