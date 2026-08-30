"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RevenueForecast } from "@/lib/analytics/forecast";

type Props = {
  forecast: RevenueForecast;
};

export function ForecastChart({ forecast }: Props) {
  const data = [
    ...forecast.history,
    ...forecast.forecast,
  ].map((item) => ({
    date: item.date,
    revenue: item.revenue,
    forecast: item.forecast,
  }));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">
          Revenue Forecast
        </h3>

        <p className="mt-1 text-sm text-zinc-400">
          Historical revenue and projected performance for the
          next 30 days.
        </p>
      </div>

      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
            />

            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  }
                )
              }
              tick={{
                fill: "#71717a",
                fontSize: 12,
              }}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />

            <YAxis
              tickFormatter={(value) =>
                `$${Number(value).toLocaleString()}`
              }
              tick={{
                fill: "#71717a",
                fontSize: 12,
              }}
              tickLine={false}
              axisLine={false}
              width={75}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
              }}
              labelFormatter={(value) =>
                new Date(value).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                )
              }
              formatter={(value, name) => [
                `$${Number(value).toFixed(2)}`,
                name === "revenue"
                  ? "Actual Revenue"
                  : "Forecast",
              ]}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={false}
              connectNulls={false}
            />

            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#a1a1aa"
              strokeWidth={2}
              strokeDasharray="6 5"
              dot={false}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          <span className="text-zinc-400">
            Actual Revenue
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-0.5 w-5 bg-zinc-400" />
          <span className="text-zinc-400">
            Forecast
          </span>
        </div>
      </div>
    </div>
  );
}