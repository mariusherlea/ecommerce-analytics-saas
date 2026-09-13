import { auth } from "../../../../../auth";
import { redirect, notFound } from "next/navigation";

import { getProductAnalytics } from "@/lib/analytics/product";
import { db } from "@/lib/db";

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

      {/* PRODUCT INFO */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-sm text-zinc-500">Current Price</p>

          <p className="mt-2 text-2xl font-semibold text-white">
            ${product.price.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-sm text-zinc-500">Stock</p>

          <p className="mt-2 text-2xl font-semibold text-white">
            {product.stock}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-sm text-zinc-500">Status</p>

          <p className="mt-2 text-2xl font-semibold text-white">
            {status}
          </p>
        </div>
      </section>
    </div>
  );
}