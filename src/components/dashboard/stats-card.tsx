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
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-white transition hover:border-zinc-700">
      <p className="text-sm font-medium text-zinc-400">
        {title}
      </p>

      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="text-3xl font-bold tracking-tight text-white">
          {value}
        </p>

        <div
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isUp
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
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

      <p className="mt-2 text-xs text-zinc-500">
        Compared to previous 30 days
      </p>
    </div>
  );
}