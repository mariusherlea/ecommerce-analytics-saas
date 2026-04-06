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

type SalesDataItem = {
  name: string;
  revenue: number;
};

type SalesChartProps = {
  data: SalesDataItem[];
};

export function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div>
        <h3 className="text-base font-semibold text-white">Sales Overview</h3>
        <p className="mt-1 text-sm text-zinc-400">
          Revenue performance over the last 7 days.
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
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />

            <Tooltip
              cursor={{ stroke: "#3f3f46", strokeDasharray: "4 4" }}
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
              formatter={(value) => {
                const amount =
                  typeof value === "number" ? value : Number(value ?? 0);
                return [`$${amount}`, "Revenue"];
              }}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{
                r: 4,
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