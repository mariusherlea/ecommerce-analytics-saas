type ProductItem = {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: "Active" | "Low Stock" | "Out of Stock";
};

type ProductsTableProps = {
  items: ProductItem[];
};

function getStatusClasses(status: ProductItem["status"]) {
  switch (status) {
    case "Active":
      return "bg-green-500/10 text-green-400";
    case "Low Stock":
      return "bg-amber-500/10 text-amber-400";
    case "Out of Stock":
      return "bg-red-500/10 text-red-400";
    default:
      return "bg-zinc-700/30 text-zinc-300";
  }
}

export function ProductsTable({ items }: ProductsTableProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Products</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Manage your products, stock, and pricing.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-zinc-700 sm:w-64"
          />

          <button
            type="button"
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-500">
              <th className="pb-3 font-medium">Product</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Price</th>
              <th className="pb-3 font-medium">Stock</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {items.map((product) => (
              <tr
                key={product.id}
                className="border-b border-zinc-800 transition hover:bg-zinc-900/60 last:border-b-0"
              >
                <td className="py-4">
                  <div>
                    <p className="font-medium text-white">{product.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">{product.id}</p>
                  </div>
                </td>

                <td className="py-4 text-zinc-400">{product.category}</td>

                <td className="py-4 font-medium text-zinc-200">
                  {product.price}
                </td>

                <td className="py-4 text-zinc-400">{product.stock}</td>

                <td className="py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                      product.status
                    )}`}
                  >
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}