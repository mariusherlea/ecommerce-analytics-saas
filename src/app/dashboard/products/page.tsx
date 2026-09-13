import { ProductsTable } from "@/components/dashboard/products-table";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function ProductsPage() {
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
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-black text-zinc-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No store found</h2>

          <p className="mt-2 text-sm text-zinc-400">
            Your account is not connected to a store yet.
          </p>
        </div>
      </div>
    );
  }

  const products = await db.product.findMany({
    where: {
      storeId: store.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const items = products.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku ?? "—",
    price: `$${product.price.toFixed(2)}`,
    stock: product.stock,
    status:
      product.stock === 0
        ? ("Out of Stock" as const)
        : product.stock <= 10
        ? ("Low Stock" as const)
        : ("Active" as const),
  }));

  return (
    <div className="w-full rounded-2xl border border-blue-500/20 bg-zinc-950 p-6 text-white shadow-[0_0_0_1px_rgba(59,130,246,0.08)]">
      <h2 className="text-2xl font-bold text-blue-400">Products</h2>

      <p className="mt-2 text-sm text-zinc-400">
        Manage and monitor your store products.
      </p>

      <div className="mt-6 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
        <ProductsTable items={items} />
      </div>
    </div>
  );
}