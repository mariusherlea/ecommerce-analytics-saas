import { TrendingDown, TrendingUp } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
};

export function StatsCard({
  title,
  value,
  change,
  trend,
}: StatsCardProps) {
  const isUp = trend === "up";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-zinc-500">{title}</p>

      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-2xl font-bold text-zinc-900">{value}</p>

        <div
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
            isUp
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isUp ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {change}
        </div>
      </div>
    </div>
  );
}