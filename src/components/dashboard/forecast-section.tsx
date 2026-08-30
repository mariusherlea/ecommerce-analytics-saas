import type { RevenueForecast } from "@/lib/analytics/forecast";
import { ForecastChart } from "@/components/dashboard/forecast-chart";
import { WeekdaySeasonality } from "@/components/dashboard/weekday-seasonality";
import { ModelComparison } from "@/components/dashboard/model-comparison";

type Props = {
  forecast: RevenueForecast;
};

export function ForecastSection({ forecast }: Props) {
  const selectedModel =
    forecast.modelComparison.selectedModel;

  const selectedMetrics =
    forecast.modelComparison[selectedModel];

  return (
    <section className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold text-white">
          Analytics & Forecast
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Revenue trends, seasonality, and future performance
          predictions.
        </p>
      </div>

      {/* FORECAST STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-zinc-400">
            Trend
          </p>

          <p className="mt-2 text-2xl font-semibold capitalize text-white">
            {forecast.trend}
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            {forecast.growthRate >= 0 ? "+" : ""}
            {forecast.growthRate.toFixed(1)}%
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-zinc-400">
            Avg. Daily Revenue
          </p>

          <p className="mt-2 text-2xl font-semibold text-white">
            ${forecast.averageDailyRevenue.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-zinc-400">
            Selected Model
          </p>

          <p className="mt-2 text-2xl font-semibold capitalize text-white">
            {selectedModel}
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            Based on backtest performance
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-zinc-400">
            Forecast Accuracy
          </p>

          <p className="mt-2 text-2xl font-semibold text-white">
            {selectedMetrics.wape.toFixed(1)}%
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            WAPE
          </p>
        </div>
      </div>

      {/* FORECAST CHART */}
      <ForecastChart forecast={forecast} />

      {/* WEEKDAY SEASONALITY */}
<WeekdaySeasonality
  seasonality={forecast.seasonality}
/>

<ModelComparison
  comparison={forecast.modelComparison}
/>
    </section>
  );
}