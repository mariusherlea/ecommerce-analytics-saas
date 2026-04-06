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
    <div className="min-h-screen space-y-6 bg-black p-6 text-zinc-100">
      
      {/* HEADER */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Overview
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Welcome back. Here is a quick summary of your store performance.
        </p>
      </section>

      {/* STATS */}
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

      {/* CHART + TOP PRODUCTS */}
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="xl:col-span-2">
  <SalesChart data={salesData} />
</div>
        </div>

        <div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <TopProducts items={topProducts} />
          </div>
        </div>
      </section>

      {/* RECENT ORDERS */}
      <section>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <RecentOrders items={recentOrders} />
        </div>
      </section>
    </div>
  );
}