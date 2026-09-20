import { auth } from "../../../../auth";
import { redirect } from "next/navigation";


import { db } from "@/lib/db";
import { CustomersTable } from "@/components/dashboard/customers-table";

export default async function CustomersPage() {
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

  const orders = await db.order.findMany({
    where: {
      storeId: store.id,
      status: {
        not: "Cancelled",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      customerEmail: true,
      total: true,
      createdAt: true,
    },
  });

  const customerMap = new Map<
    string,
    {
      email: string;
      orderCount: number;
      revenue: number;
      lastOrderDate: Date;
    }
  >();

  for (const order of orders) {
    const existing = customerMap.get(
      order.customerEmail
    );

    if (existing) {
      existing.orderCount += 1;
      existing.revenue += order.total;

      if (
        order.createdAt > existing.lastOrderDate
      ) {
        existing.lastOrderDate = order.createdAt;
      }
    } else {
      customerMap.set(order.customerEmail, {
        email: order.customerEmail,
        orderCount: 1,
        revenue: order.total,
        lastOrderDate: order.createdAt,
      });
    }
  }

  const customers = Array.from(
    customerMap.values()
  );

  const totalCustomers = customers.length;

const totalRevenue = customers.reduce(
  (total, customer) => total + customer.revenue,
  0
);

const averageCustomerRevenue =
  totalCustomers > 0
    ? totalRevenue / totalCustomers
    : 0;

const repeatCustomers = customers.filter(
  (customer) => customer.orderCount >= 2
).length;

  return (
    <div className="w-full rounded-2xl border border-blue-500/20 bg-zinc-950 p-6 text-white shadow-[0_0_0_1px_rgba(59,130,246,0.08)]">
      <h2 className="text-2xl font-bold text-blue-400">
        Customers
      </h2>

      <p className="mt-2 text-sm text-zinc-400">
        Manage and monitor your store customers.
      </p>

      <div className="mt-6 space-y-6">
  {/* KPI CARDS */}
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <p className="text-sm text-zinc-500">
        Total Customers
      </p>

      <p className="mt-2 text-2xl font-semibold text-white">
        {totalCustomers.toLocaleString()}
      </p>
    </div>

    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <p className="text-sm text-zinc-500">
        Total Revenue
      </p>

      <p className="mt-2 text-2xl font-semibold text-white">
        $
        {totalRevenue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </div>

    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <p className="text-sm text-zinc-500">
        Average Customer Revenue
      </p>

      <p className="mt-2 text-2xl font-semibold text-white">
        $
        {averageCustomerRevenue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </div>

    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <p className="text-sm text-zinc-500">
        Repeat Customers
      </p>

      <p className="mt-2 text-2xl font-semibold text-white">
        {repeatCustomers.toLocaleString()}
      </p>
    </div>
  </div>

  {/* CUSTOMERS TABLE */}
  <CustomersTable
  customers={customers.map((customer) => ({
    email: customer.email,
    orderCount: customer.orderCount,
    revenue: customer.revenue,
    lastOrderDate:
      customer.lastOrderDate.toISOString(),
  }))}
/>
</div>
    </div>
  );
}