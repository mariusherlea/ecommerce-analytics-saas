import type { RevenueForecast } from "@/lib/analytics/forecast";

type Props = {
  comparison: RevenueForecast["modelComparison"];
};

export function ModelComparison({
  comparison,
}: Props) {
  const models = [
    {
      key: "baseline" as const,
      name: "Baseline",
      metrics: comparison.baseline,
    },
    {
      key: "seasonal" as const,
      name: "Seasonal",
      metrics: comparison.seasonal,
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">
          Model Comparison
        </h3>

        <p className="mt-1 text-sm text-zinc-400">
          Compare forecasting models using historical
          backtesting.
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-zinc-500">
              <th className="pb-3 font-medium">
                Model
              </th>

              <th className="pb-3 text-right font-medium">
                MAE
              </th>

              <th className="pb-3 text-right font-medium">
                MAPE
              </th>

              <th className="pb-3 text-right font-medium">
                WAPE
              </th>
            </tr>
          </thead>

          <tbody>
            {models.map((model) => {
              const isSelected =
                model.key ===
                comparison.selectedModel;

              return (
                <tr
                  key={model.key}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-white">
                        {model.name}
                      </span>

                      {isSelected && (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                          Selected
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 text-right text-zinc-300">
                    ${model.metrics.mae.toFixed(2)}
                  </td>

                  <td className="py-4 text-right text-zinc-300">
                    {model.metrics.mape.toFixed(1)}%
                  </td>

                  <td
                    className={`py-4 text-right font-medium ${
                      isSelected
                        ? "text-emerald-400"
                        : "text-zinc-300"
                    }`}
                  >
                    {model.metrics.wape.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="mt-5 flex flex-col gap-1 border-t border-white/10 pt-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Lower error values indicate better forecasting
          performance.
        </span>

        <span>
          Backtest sample:{" "}
          {comparison[comparison.selectedModel].sampleSize}{" "}
          observations
        </span>
      </div>
    </div>
  );
}