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
    <div className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700 hover:bg-zinc-800/70">
      
      {/* TITLE */}
      <p className="text-sm font-medium text-zinc-400">{title}</p>

      {/* VALUE + TREND */}
      <div className="mt-4 flex items-center justify-between">
        
        <p className="text-3xl font-semibold tracking-tight text-white">
          {value}
        </p>

        <div
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
            isUp
              ? "bg-green-500/10 text-green-400"
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

      {/* SUBTLE FOOTER */}
      <p className="mt-3 text-xs text-zinc-500">
        Compared to last period
      </p>
    </div>
  );
}