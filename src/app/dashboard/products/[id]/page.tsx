import { auth } from "../../../../../auth";
import { redirect, notFound } from "next/navigation";

import { getProductAnalytics } from "@/lib/analytics/product";
import { db } from "@/lib/db";
import { ProductSalesChart } from "@/components/dashboard/product-sales-chart";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getPercentageChange(
  current: number,
  previous: number
) {
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }

  return ((current - previous) / previous) * 100;
}

function ChangeIndicator({
  value,
}: {
  value: number | null;
}) {
  if (value === null) {
    return (
      <p className="mt-2 text-xs text-zinc-500">
        No previous data
      </p>
    );
  }

  const isPositive = value > 0;
  const isNegative = value < 0;

  return (
    <p
      className={`mt-2 text-xs ${
        isPositive
          ? "text-green-400"
          : isNegative
          ? "text-red-400"
          : "text-zinc-500"
      }`}
    >
      {value > 0 ? "+" : ""}
      {value.toFixed(1)}% vs previous 30 days
    </p>
  );
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const store = await db.store.findFirst({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!store) {
    redirect("/dashboard/products");
  }

  const analytics = await getProductAnalytics(id, store.id);

  if (!analytics) {
    notFound();
  }

  const { product } = analytics;

  const status =
    product.stock === 0
      ? "Out of Stock"
      : product.stock <= 10
      ? "Low Stock"
      : "Active";

  const revenueChange = getPercentageChange(
    analytics.currentPeriod.revenue,
    analytics.previousPeriod.revenue
  );

  const unitsSoldChange = getPercentageChange(
    analytics.currentPeriod.unitsSold,
    analytics.previousPeriod.unitsSold
  );

  const ordersChange = getPercentageChange(
    analytics.currentPeriod.orderCount,
    analytics.previousPeriod.orderCount
  );

  const aovChange = getPercentageChange(
    analytics.currentPeriod.averageOrderValue,
    analytics.previousPeriod.averageOrderValue
  );

const totalSalesDays = analytics.salesData.filter(
  (day) => day.revenue > 0
).length;

const averageDailyRevenue =
  analytics.salesData.length > 0
    ? analytics.currentPeriod.revenue /
      analytics.salesData.length
    : 0;

const averageUnitsPerDay =
  analytics.salesData.length > 0
    ? analytics.currentPeriod.unitsSold /
      analytics.salesData.length
    : 0;

const salesDays = analytics.salesData.filter(
  (day) => day.revenue > 0
);

const bestSalesDay =
  analytics.salesData.length > 0
    ? analytics.salesData.reduce((best, day) =>
        day.revenue > best.revenue ? day : best
      )
    : null;

const worstSalesDay =
  salesDays.length > 0
    ? salesDays.reduce((worst, day) =>
        day.revenue < worst.revenue ? day : worst
      )
    : null;

    const averageDailySales = averageUnitsPerDay;

const daysOfStock =
  averageDailySales > 0
    ? product.stock / averageDailySales
    : null;

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <section>
        <p className="text-sm text-zinc-500">
          Products / {product.name}
        </p>

        <div className="mt-2 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span>SKU: {product.sku ?? "—"}</span>
            <span>Price: ${product.price.toFixed(2)}</span>
          </div>
        </div>
      </section>

      {/* PERFORMANCE */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-sm text-zinc-500">
            Revenue
          </p>

          <p className="mt-2 text-2xl font-semibold text-white">
            $
            {analytics.currentPeriod.revenue.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </p>

          <ChangeIndicator value={revenueChange} />
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-sm text-zinc-500">
            Units Sold
          </p>

          <p className="mt-2 text-2xl font-semibold text-white">
            {analytics.currentPeriod.unitsSold.toLocaleString()}
          </p>

          <ChangeIndicator value={unitsSoldChange} />
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-sm text-zinc-500">
            Orders
          </p>

          <p className="mt-2 text-2xl font-semibold text-white">
            {analytics.currentPeriod.orderCount.toLocaleString()}
          </p>

          <ChangeIndicator value={ordersChange} />
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-sm text-zinc-500">
            Average Order Value
          </p>

          <p className="mt-2 text-2xl font-semibold text-white">
            $
            {analytics.currentPeriod.averageOrderValue.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </p>

          <ChangeIndicator value={aovChange} />
        </div>
      </section>

      <ProductSalesChart data={analytics.salesData} />


      {/* SALES SUMMARY */}
<section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
  <div>
    <h2 className="text-lg font-semibold text-white">
      Sales Summary
    </h2>

    <p className="mt-1 text-sm text-zinc-400">
      Sales performance summary for the last 30 days.
    </p>
  </div>

  <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
    <div>
      <p className="text-sm text-zinc-500">
        Average Daily Revenue
      </p>

      <p className="mt-1 text-xl font-semibold text-white">
        $
        {averageDailyRevenue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </div>

    <div>
      <p className="text-sm text-zinc-500">
        Average Units / Day
      </p>

      <p className="mt-1 text-xl font-semibold text-white">
        {averageUnitsPerDay.toLocaleString(undefined, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}
      </p>
    </div>

    <div>
      <p className="text-sm text-zinc-500">
        Best Sales Day
      </p>

      <p className="mt-1 text-xl font-semibold text-white">
        {bestSalesDay
          ? new Date(
              `${bestSalesDay.date}T00:00:00`
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : "—"}
      </p>

      <p className="mt-1 text-xs text-zinc-500">
        $
        {bestSalesDay?.revenue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) ?? "0.00"}
      </p>
    </div>

    <div>
      <p className="text-sm text-zinc-500">
        Worst Sales Day
      </p>

      <p className="mt-1 text-xl font-semibold text-white">
        {worstSalesDay
          ? new Date(
              `${worstSalesDay.date}T00:00:00`
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : "—"}
      </p>

      <p className="mt-1 text-xs text-zinc-500">
        $
        {worstSalesDay?.revenue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) ?? "0.00"}
      </p>
    </div>

    <div>
      <p className="text-sm text-zinc-500">
        Days With Sales
      </p>

      <p className="mt-1 text-xl font-semibold text-white">
        {totalSalesDays} / 30
      </p>
    </div>
  </div>
</section>

{/* STORE CONTRIBUTION */}
<section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
  <div>
    <h2 className="text-lg font-semibold text-white">
      Store Contribution
    </h2>

    <p className="mt-1 text-sm text-zinc-400">
      This products contribution to store revenue over the last 30 days.
    </p>
  </div>

  <div className="mt-6 grid gap-6 sm:grid-cols-3">
    <div>
      <p className="text-sm text-zinc-500">
        Product Revenue
      </p>

      <p className="mt-1 text-xl font-semibold text-white">
        $
        {analytics.storeContribution.productRevenue.toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )}
      </p>
    </div>

    <div>
      <p className="text-sm text-zinc-500">
        Store Revenue
      </p>

      <p className="mt-1 text-xl font-semibold text-white">
        $
        {analytics.storeContribution.storeRevenue.toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )}
      </p>
    </div>

    <div>
      <p className="text-sm text-zinc-500">
        Revenue Contribution
      </p>

      <p className="mt-1 text-2xl font-semibold text-blue-400">
        {analytics.storeContribution.revenuePercentage.toFixed(1)}%
      </p>
    </div>
  </div>
</section>

{/* PRODUCT RANKING */}
<section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
  <div>
    <h2 className="text-lg font-semibold text-white">
      Product Ranking
    </h2>

    <p className="mt-1 text-sm text-zinc-400">
      Product performance ranking over the last 30 days.
    </p>
  </div>

  <div className="mt-6 grid gap-6 sm:grid-cols-3">
    <div>
      <p className="text-sm text-zinc-500">
        Revenue Rank
      </p>

      <p className="mt-1 text-2xl font-semibold text-white">
        #{analytics.productRanking.revenueRank}
        <span className="ml-1 text-sm font-normal text-zinc-500">
          of {analytics.productRanking.totalProducts}
        </span>
      </p>
    </div>

    <div>
      <p className="text-sm text-zinc-500">
        Units Sold Rank
      </p>

      <p className="mt-1 text-2xl font-semibold text-white">
        #{analytics.productRanking.unitsSoldRank}
        <span className="ml-1 text-sm font-normal text-zinc-500">
          of {analytics.productRanking.totalProducts}
        </span>
      </p>
    </div>

    <div>
      <p className="text-sm text-zinc-500">
        Orders Rank
      </p>

      <p className="mt-1 text-2xl font-semibold text-white">
        #{analytics.productRanking.ordersRank}
        <span className="ml-1 text-sm font-normal text-zinc-500">
          of {analytics.productRanking.totalProducts}
        </span>
      </p>
    </div>
  </div>
</section>

    {/* INVENTORY */}
<section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
  <div>
    <h2 className="text-lg font-semibold text-white">
      Inventory
    </h2>

    <p className="mt-1 text-sm text-zinc-400">
      Inventory position based on recent sales velocity.
    </p>
  </div>

  <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
    <div>
      <p className="text-sm text-zinc-500">
        Current Stock
      </p>

      <p className="mt-1 text-xl font-semibold text-white">
        {product.stock.toLocaleString()}
      </p>
    </div>

    <div>
      <p className="text-sm text-zinc-500">
        Status
      </p>

      <p className="mt-1 text-xl font-semibold text-white">
        {status}
      </p>
    </div>

    <div>
      <p className="text-sm text-zinc-500">
        Average Daily Sales
      </p>

      <p className="mt-1 text-xl font-semibold text-white">
        {averageDailySales.toLocaleString(undefined, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}
      </p>
    </div>

    <div>
      <p className="text-sm text-zinc-500">
        Days of Stock
      </p>

      <p className="mt-1 text-xl font-semibold text-white">
        {daysOfStock !== null
          ? `${Math.round(daysOfStock)} days`
          : "No sales data"}
      </p>
    </div>
  </div>
</section>
    </div>
  );
}