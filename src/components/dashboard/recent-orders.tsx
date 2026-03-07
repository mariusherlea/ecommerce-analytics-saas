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
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-amber-100 text-amber-700";
    case "Shipped":
      return "bg-blue-100 text-blue-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
}

export function RecentOrders({ items }: RecentOrdersProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-zinc-900">Recent Orders</h3>
      <p className="mt-1 text-sm text-zinc-500">
        Latest orders placed in your store.
      </p>

      <div className="mt-6 overflow-x-auto">
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
            {items.map((order) => (
              <tr key={order.id} className="border-b border-zinc-100 last:border-b-0">
                <td className="py-4 font-medium text-zinc-900">{order.id}</td>
                <td className="py-4 text-zinc-600">{order.customer}</td>
                <td className="py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-4 font-medium text-zinc-900">{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}