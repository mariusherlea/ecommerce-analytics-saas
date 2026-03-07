import { RecentOrders } from "@/components/dashboard/recent-orders";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { StatsCard } from "@/components/dashboard/stats-card";
import { TopProducts } from "@/components/dashboard/top-products";
import {
  recentOrders,
  salesData,
  stats,
  topProducts,
} from "@/data/mock/dashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          Overview
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Welcome back. Here is a quick summary of your store performance.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart data={salesData} />
        </div>

        <div>
          <TopProducts items={topProducts} />
        </div>
      </section>

      <section>
        <RecentOrders items={recentOrders} />
      </section>
    </div>
  );
}