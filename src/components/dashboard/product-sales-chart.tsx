"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ProductSalesDataItem = {
  date: string;
  revenue: number;
  unitsSold: number;
};

type ProductSalesChartProps = {
  data: ProductSalesDataItem[];
};

type Metric = "revenue" | "unitsSold";

export function ProductSalesChart({
  data,
}: ProductSalesChartProps) {
  const [metric, setMetric] = useState<Metric>("revenue");

  const isRevenue = metric === "revenue";

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Sales Performance
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            {isRevenue
              ? "Revenue performance over the last 30 days."
              : "Units sold over the last 30 days."}
          </p>
        </div>

        <select
          value={metric}
          onChange={(event) =>
            setMetric(event.target.value as Metric)
          }
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-zinc-700"
        >
          <option value="revenue">Revenue</option>
          <option value="unitsSold">Units Sold</option>
        </select>
      </div>

      <div className="mt-6 h-[320px] min-h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#27272a"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(`${value}T00:00:00`);

                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              tickFormatter={(value) =>
                isRevenue ? `$${value}` : value
              }
            />

            <Tooltip
              cursor={{
                stroke: "#3f3f46",
                strokeDasharray: "4 4",
              }}
              contentStyle={{
                backgroundColor: "#09090b",
                border: "1px solid #27272a",
                borderRadius: "16px",
                color: "#ffffff",
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              }}
              labelStyle={{
                color: "#ffffff",
                fontWeight: 600,
              }}
              itemStyle={{
                color: "#d4d4d8",
              }}
              labelFormatter={(value) => {
                const date = new Date(`${value}T00:00:00`);

                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }}
              formatter={(value) => {
                const amount =
                  typeof value === "number"
                    ? value
                    : Number(value ?? 0);

                return [
                  isRevenue
                    ? `$${amount.toFixed(2)}`
                    : amount.toLocaleString(),
                  isRevenue ? "Revenue" : "Units Sold",
                ];
              }}
            />

            <Line
              type="monotone"
              dataKey={metric}
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{
                r: 3,
                strokeWidth: 2,
                fill: "#3b82f6",
                stroke: "#0a0a0a",
              }}
              activeDot={{
                r: 6,
                fill: "#60a5fa",
                stroke: "#0a0a0a",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}