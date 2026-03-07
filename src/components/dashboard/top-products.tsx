type TopProduct = {
  id: string;
  name: string;
  sales: number;
  revenue: string;
};

type TopProductsProps = {
  items: TopProduct[];
};

export function TopProducts({ items }: TopProductsProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-zinc-900">Top Products</h3>
      <p className="mt-1 text-sm text-zinc-500">
        Best-performing products by sales volume.
      </p>

      <div className="mt-6 space-y-4">
        {items.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center justify-between rounded-xl border border-zinc-100 p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
                {index + 1}
              </div>

              <div>
                <p className="text-sm font-medium text-zinc-900">
                  {product.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {product.sales} sales
                </p>
              </div>
            </div>

            <p className="text-sm font-semibold text-zinc-900">
              {product.revenue}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}