export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Welcome back. Here is a quick summary of your store.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">Total Revenue</p>
          <p className="mt-2 text-2xl font-bold">$12,480</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">Orders</p>
          <p className="mt-2 text-2xl font-bold">324</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">Customers</p>
          <p className="mt-2 text-2xl font-bold">198</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-zinc-500">Avg. Order Value</p>
          <p className="mt-2 text-2xl font-bold">$38.52</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm xl:col-span-2">
          <h3 className="text-base font-semibold">Sales Chart</h3>
          <div className="mt-4 flex h-72 items-center justify-center rounded-xl border border-dashed border-zinc-300 text-sm text-zinc-400">
            Chart area
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold">Top Products</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">Premium T-Shirt</span>
              <span className="text-sm font-medium">84 sales</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">Minimal Hoodie</span>
              <span className="text-sm font-medium">63 sales</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">Black Cap</span>
              <span className="text-sm font-medium">41 sales</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold">Recent Orders</h3>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-zinc-500">
                <th className="pb-3 font-medium">Order</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-100">
                <td className="py-3">#1001</td>
                <td className="py-3">mario@example.com</td>
                <td className="py-3">Paid</td>
                <td className="py-3">$120.00</td>
              </tr>
              <tr className="border-b border-zinc-100">
                <td className="py-3">#1002</td>
                <td className="py-3">ana@example.com</td>
                <td className="py-3">Pending</td>
                <td className="py-3">$89.00</td>
              </tr>
              <tr>
                <td className="py-3">#1003</td>
                <td className="py-3">dan@example.com</td>
                <td className="py-3">Paid</td>
                <td className="py-3">$56.50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}