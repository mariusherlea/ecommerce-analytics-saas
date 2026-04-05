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
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Sales Overview</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Revenue performance over the last 7 days.
          </p>
        </div>
      </div>

      <div className="mt-6 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
           <Tooltip
  formatter={(value) => {
    const amount = typeof value === "number" ? value : Number(value ?? 0);
    return [`$${amount}`, "Revenue"];
  }}
/>
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="currentColor"
              strokeWidth={3}
              dot={false}
              className="text-zinc-900"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}