import { auth } from "../../../../../auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";


import { db } from "@/lib/db";

type OrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderPage({
  params,
}: OrderPageProps) {
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
    redirect("/dashboard/orders");
  }

  const order = await db.order.findFirst({
    where: {
      id,
      storeId: store.id,
    },
    select: {
      id: true,
      externalOrderId: true,
      customerEmail: true,
      total: true,
      status: true,
      createdAt: true,
      items: {
        select: {
          id: true,
          quantity: true,
          price: true,
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const orderNumber = order.externalOrderId ?? order.id;

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <section>
        <p className="text-sm text-zinc-500">
          Orders / {orderNumber}
        </p>

        <div className="mt-2 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Order {orderNumber}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
            <span>
              {order.createdAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>

            <span>{order.customerEmail}</span>

            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
              {order.status}
            </span>
          </div>
        </div>
      </section>

      {/* ORDER SUMMARY */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-sm text-zinc-500">
            Customer
          </p>

          <p className="mt-2 font-medium text-white">
            {order.customerEmail}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-sm text-zinc-500">
            Status
          </p>

          <p className="mt-2 font-medium text-white">
            {order.status}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-sm text-zinc-500">
            Total
          </p>

          <p className="mt-2 text-2xl font-semibold text-white">
            $
            {order.total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </section>

      {/* ORDER ITEMS */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Order Items
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Products included in this order.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-900/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-zinc-400">
                    Product
                  </th>

                  <th className="px-4 py-3 font-medium text-zinc-400">
                    SKU
                  </th>

                  <th className="px-4 py-3 font-medium text-zinc-400">
                    Quantity
                  </th>

                  <th className="px-4 py-3 font-medium text-zinc-400">
                    Price
                  </th>

                  <th className="px-4 py-3 font-medium text-zinc-400">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800/70">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-4">
                      <Link
                        href={`/dashboard/products/${item.product.id}`}
                        className="font-medium text-white transition hover:text-blue-400"
                      >
                        {item.product.name}
                      </Link>
                    </td>

                    <td className="px-4 py-4 text-zinc-400">
                      {item.product.sku ?? "—"}
                    </td>

                    <td className="px-4 py-4 text-zinc-300">
                      {item.quantity}
                    </td>

                    <td className="px-4 py-4 text-zinc-300">
                      $
                      {item.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td className="px-4 py-4 font-medium text-white">
                      $
                      {(item.quantity * item.price).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}