export function DashboardSkeleton() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem-3rem)] flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="skeleton h-7 w-40" />
          <div className="skeleton h-4 w-64" />
        </div>
        <div className="skeleton h-8 w-24 rounded-lg" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2">
            <div className="skeleton h-[76px] rounded-xl" />
          </div>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="skeleton h-[220px] rounded-xl" />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="skeleton h-[220px] rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="col-span-12 lg:col-span-4">
            <div className="skeleton h-[240px] rounded-xl" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="col-span-12 xl:col-span-6">
            <div className="skeleton h-[200px] rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
