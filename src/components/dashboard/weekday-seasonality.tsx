import type { RevenueForecast } from "@/lib/analytics/forecast";

type Props = {
  seasonality: RevenueForecast["seasonality"];
};

export function WeekdaySeasonality({
  seasonality,
}: Props) {
  const maxIndex = Math.max(
    ...seasonality.map((item) => item.index),
    1
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">
          Weekday Seasonality
        </h3>

        <p className="mt-1 text-sm text-zinc-400">
          Revenue performance by day of week.
        </p>
      </div>

      {/* DAYS */}
      <div className="space-y-4">
        {seasonality.map((item) => {
          const percentage = item.index * 100;

          const width = Math.min(
            (item.index / maxIndex) * 100,
            100
          );

          const isAboveAverage =
            item.index >= 1;

          return (
            <div
              key={item.day}
              className="grid grid-cols-[90px_1fr_auto] items-center gap-4"
            >
              {/* DAY */}
              <span className="text-sm font-medium text-zinc-300">
                {item.day}
              </span>

              {/* BAR */}
              <div className="relative h-8 overflow-hidden rounded-lg bg-white/[0.04]">
                <div
                  className="absolute inset-y-0 left-0 rounded-lg bg-blue-500/20 transition-all"
                  style={{
                    width: `${width}%`,
                  }}
                />

                <div className="relative flex h-full items-center px-3">
                  <span className="text-xs text-zinc-400">
                    ${item.averageRevenue.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* INDEX */}
              <div className="w-16 text-right">
                <span
                  className={`text-sm font-semibold ${
                    isAboveAverage
                      ? "text-emerald-400"
                      : "text-zinc-400"
                  }`}
                >
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* LEGEND */}
      <div className="mt-6 border-t border-white/10 pt-4">
        <p className="text-xs text-zinc-500">
          100% represents the average daily revenue.
          Values above 100% indicate stronger-than-average
          performance.
        </p>
      </div>
    </div>
  );
}