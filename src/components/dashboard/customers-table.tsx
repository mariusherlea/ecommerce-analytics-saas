"use client";

import { useState } from "react";

type CustomerItem = {
  email: string;
  orderCount: number;
  revenue: number;
  lastOrderDate: string;
};

type CustomersTableProps = {
  customers: CustomerItem[];
};

export function CustomersTable({
  customers,
}: CustomersTableProps) {
  const [searchTerm, setSearchTerm] =
    useState("");

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.email
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div>
      {/* SEARCH */}
      <div className="mb-4">
        <label
          htmlFor="customer-search"
          className="text-sm text-zinc-400"
        >
          Search customers
        </label>

        <input
          id="customer-search"
          type="text"
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          placeholder="Search by customer email..."
          className="mt-1 block w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-zinc-700 sm:max-w-md"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-blue-500/10 bg-blue-500/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-950/60">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-400">
                  Customer
                </th>

                <th className="px-4 py-3 font-medium text-zinc-400">
                  Orders
                </th>

                <th className="px-4 py-3 font-medium text-zinc-400">
                  Revenue
                </th>

                <th className="px-4 py-3 font-medium text-zinc-400">
                  Last Order
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/70">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.email}
                  className="transition hover:bg-zinc-900/60"
                >
                  <td className="px-4 py-4 font-medium text-white">
                    {customer.email}
                  </td>

                  <td className="px-4 py-4 text-zinc-300">
                    {customer.orderCount}
                  </td>

                  <td className="px-4 py-4 font-medium text-white">
                    $
                    {customer.revenue.toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </td>

                  <td className="px-4 py-4 text-zinc-400">
                    {new Date(
                      customer.lastOrderDate
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-zinc-500"
                  >
                    No customers found.
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