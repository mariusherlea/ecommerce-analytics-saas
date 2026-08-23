//src/app/dashboard/page.tsx
import { auth } from "../../../auth";
import { redirect } from "next/navigation";

import { RecentOrders } from "@/components/dashboard/recent-orders";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { StatsCard } from "@/components/dashboard/stats-card";
import { TopProducts } from "@/components/dashboard/top-products";

import { getDashboardAnalytics } from "@/lib/analytics/dashboard";
import { getOverviewStats } from "@/lib/analytics/overview";
import { db } from "@/lib/db";
import { getRevenueForecast } from "@/lib/analytics/forecast";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Find the user's store once
  const store = await db.store.findFirst({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  // Authenticated user without a store
 if (!store) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-black text-zinc-100">
      <div className="text-center">
        <h2 className="text-xl font-semibold">
          No store found
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          Your account is not connected to a store yet.
        </p>
      </div>
    </div>
  );
}

const forecast = await getRevenueForecast(store.id);

console.log("FORECAST:", forecast);

  // Overview statistics
  const stats = await getOverviewStats(store.id);

  // Dashboard analytics
  const analytics = await getDashboardAnalytics(store.id);

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
        <StatsCard
          title="Orders"
          value={stats.orders.value.toLocaleString()}
          change={`${stats.orders.change >= 0 ? "+" : ""}${stats.orders.change.toFixed(
            1
          )}%`}
          trend={stats.orders.trend}
        />

        <StatsCard
          title="Revenue"
          value={`$${stats.revenue.value.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`}
          change={`${stats.revenue.change >= 0 ? "+" : ""}${stats.revenue.change.toFixed(
            1
          )}%`}
          trend={stats.revenue.trend}
        />

        <StatsCard
          title="Customers"
          value={stats.customers.value.toLocaleString()}
          change={`${stats.customers.change >= 0 ? "+" : ""}${stats.customers.change.toFixed(
            1
          )}%`}
          trend={stats.customers.trend}
        />

        <StatsCard
          title="Average Order Value"
          value={`$${stats.averageOrderValue.value.toFixed(2)}`}
          change={`${stats.averageOrderValue.change >= 0 ? "+" : ""}${stats.averageOrderValue.change.toFixed(
            1
          )}%`}
          trend={stats.averageOrderValue.trend}
        />
      </section>

      {/* SALES + TOP PRODUCTS */}
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart data={analytics.salesData} />
        </div>

        <div>
          <TopProducts items={analytics.topProducts} />
        </div>
      </section>

      {/* RECENT ORDERS */}
      <section>
        <RecentOrders items={analytics.recentOrders} />
      </section>
    </div>
  );
}