type RecentOrder = {
  id: string;
  customer: string;
  status: string;
  total: string;
};

type RecentOrdersProps = {
  items: RecentOrder[];
};

function getStatusClasses(status: string) {
  switch (status) {
    case "Paid":
      return "bg-green-500/10 text-green-400";
    case "Pending":
      return "bg-amber-500/10 text-amber-400";
    case "Shipped":
      return "bg-blue-500/10 text-blue-400";
    case "Cancelled":
      return "bg-red-500/10 text-red-400";
    default:
      return "bg-zinc-700/30 text-zinc-300";
  }
}

export function RecentOrders({ items }: RecentOrdersProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      
      {/* HEADER */}
      <h3 className="text-base font-semibold text-white">Recent Orders</h3>
      <p className="mt-1 text-sm text-zinc-400">
        Latest orders placed in your store.
      </p>

      {/* TABLE */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          
          {/* HEAD */}
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-500">
              <th className="pb-3 font-medium">Order</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-right">Total</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {items.map((order) => (
              <tr
                key={order.id}
                className="border-b border-zinc-800 last:border-b-0 hover:bg-zinc-900/60 transition"
              >
                <td className="py-4 font-medium text-white">
                  {order.id}
                </td>

                <td className="py-4 text-zinc-400">
                  {order.customer}
                </td>

                <td className="py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="py-4 text-right font-medium text-zinc-200">
                  {order.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}