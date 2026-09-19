"use client";

import Link from "next/link";
import { useState } from "react";

type OrderItem = {
  id: string;
  externalOrderId: string | null;
  customerEmail: string;
  total: number;
  status: string;
  createdAt: string;
};

type OrdersTableProps = {
  orders: OrderItem[];
};

export function OrdersTable({
  orders,
}: OrdersTableProps) {
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [searchTerm, setSearchTerm] =
    useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "All" ||
      order.status === statusFilter;

    const query = searchTerm.trim().toLowerCase();

    const orderNumber =
      order.externalOrderId ?? order.id;

    const matchesSearch =
      query === "" ||
      orderNumber.toLowerCase().includes(query) ||
      order.customerEmail.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      {/* FILTERS */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-md">
          <label
            htmlFor="order-search"
            className="text-sm text-zinc-400"
          >
            Search orders
          </label>

          <input
            id="order-search"
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search by order ID or customer email..."
            className="mt-1 block w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-zinc-700"
          />
        </div>

        <div>
          <label
            htmlFor="status-filter"
            className="text-sm text-zinc-400"
          >
            Filter by status
          </label>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="mt-1 block rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-zinc-700"
          >
            <option value="All">
              All Statuses
            </option>

            <option value="Paid">
              Paid
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Shipped">
              Shipped
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-blue-500/10 bg-blue-500/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-950/60">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-400">
                  Order
                </th>

                <th className="px-4 py-3 font-medium text-zinc-400">
                  Customer
                </th>

                <th className="px-4 py-3 font-medium text-zinc-400">
                  Date
                </th>

                <th className="px-4 py-3 font-medium text-zinc-400">
                  Total
                </th>

                <th className="px-4 py-3 font-medium text-zinc-400">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/70">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="transition hover:bg-zinc-900/60"
                >
                  <td className="px-4 py-4">
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="font-medium text-white transition hover:text-blue-400"
                    >
                      {order.externalOrderId ??
                        order.id}
                    </Link>
                  </td>

                  <td className="px-4 py-4 text-zinc-300">
                    {order.customerEmail}
                  </td>

                  <td className="px-4 py-4 text-zinc-400">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  <td className="px-4 py-4 font-medium text-white">
                    $
                    {order.total.toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs ${
                        order.status === "Paid"
                          ? "border-green-500/30 bg-green-500/10 text-green-400"
                          : order.status === "Shipped"
                          ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                          : order.status === "Pending"
                          ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                          : order.status ===
                            "Cancelled"
                          ? "border-red-500/30 bg-red-500/10 text-red-400"
                          : "border-zinc-700 bg-zinc-900 text-zinc-300"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-zinc-500"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}