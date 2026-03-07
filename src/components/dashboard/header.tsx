export function DashboardHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500">
          Monitor your store performance and analytics.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden rounded-full border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 sm:block">
          Free Plan
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
          M
        </div>
      </div>
    </header>
  );
}