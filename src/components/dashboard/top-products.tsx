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
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      
      {/* HEADER */}
      <h3 className="text-base font-semibold text-white">Top Products</h3>
      <p className="mt-1 text-sm text-zinc-400">
        Best-performing products by sales volume.
      </p>

      {/* LIST */}
      <div className="mt-6 space-y-3">
        {items.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 transition hover:bg-zinc-900 hover:border-zinc-700"
          >
            {/* LEFT */}
            <div className="flex items-center gap-3">
              
              {/* RANK */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-white">
                {index + 1}
              </div>

              {/* INFO */}
              <div>
                <p className="text-sm font-medium text-white">
                  {product.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {product.sales} sales
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <p className="text-sm font-semibold text-zinc-200">
              {product.revenue}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}