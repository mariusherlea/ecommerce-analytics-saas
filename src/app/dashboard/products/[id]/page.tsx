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
    <p className="text-sm text-zinc-500">Revenue</p>

    <p className="mt-2 text-2xl font-semibold text-white">
      ${analytics.metrics.revenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </p>
  </div>

  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
    <p className="text-sm text-zinc-500">Units Sold</p>

    <p className="mt-2 text-2xl font-semibold text-white">
      {analytics.metrics.unitsSold.toLocaleString()}
    </p>
  </div>

  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
    <p className="text-sm text-zinc-500">Orders</p>

    <p className="mt-2 text-2xl font-semibold text-white">
      {analytics.metrics.orderCount.toLocaleString()}
    </p>
  </div>

  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
    <p className="text-sm text-zinc-500">Average Order Value</p>

    <p className="mt-2 text-2xl font-semibold text-white">
      ${analytics.metrics.averageOrderValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </p>
  </div>
</section>
<ProductSalesChart data={analytics.salesData} />

{/* INVENTORY */}
<section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
  <h2 className="text-lg font-semibold text-white">
    Inventory
  </h2>

  <div className="mt-4 grid gap-4 sm:grid-cols-2">
    <div>
      <p className="text-sm text-zinc-500">Current Stock</p>
      <p className="mt-1 text-xl font-semibold text-white">
        {product.stock.toLocaleString()}
      </p>
    </div>

    <div>
      <p className="text-sm text-zinc-500">Status</p>
      <p className="mt-1 text-xl font-semibold text-white">
        {status}
      </p>
    </div>
  </div>
</section>
    </div>
  );
}