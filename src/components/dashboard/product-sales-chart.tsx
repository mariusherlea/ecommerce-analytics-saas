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

type ProductSalesDataItem = {
  date: string;
  revenue: number;
};

type ProductSalesChartProps = {
  data: ProductSalesDataItem[];
};

export function ProductSalesChart({
  data,
}: ProductSalesChartProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Sales Performance
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Revenue performance over the last 30 days.
        </p>
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
              tickFormatter={(value) => `$${value}`}
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
                  `$${amount.toFixed(2)}`,
                  "Revenue",
                ];
              }}
            />

            <Line
              type="monotone"
              dataKey="revenue"
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