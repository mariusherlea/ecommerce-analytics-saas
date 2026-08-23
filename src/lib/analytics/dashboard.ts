import { db } from "@/lib/db";

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function formatDay(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export async function getDashboardAnalytics(storeId: string) {
  const now = new Date();

  // Last 30 days
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 29);
  startDate.setHours(0, 0, 0, 0);

  const orders = await db.order.findMany({
    where: {
      storeId,
      createdAt: {
        gte: startDate,
        lte: now,
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  /*
   * ----------------------------------------
   * SALES BY DAY
   * ----------------------------------------
   */

  const salesMap = new Map<
    string,
    {
      date: Date;
      revenue: number;
    }
  >();

  // Create all 30 days first.
  // This is important because days without sales
  // should still appear on the chart.
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const day = startOfDay(date);
    const key = day.toISOString().slice(0, 10);

    salesMap.set(key, {
      date: day,
      revenue: 0,
    });
  }

  for (const order of orders) {
    if (
      order.status === "Cancelled" ||
      order.status === "Pending"
    ) {
      continue;
    }

    const day = startOfDay(order.createdAt);
    const key = day.toISOString().slice(0, 10);

    const existing = salesMap.get(key);

    if (existing) {
      existing.revenue += Number(order.total);
    }
  }

  const salesData = Array.from(salesMap.values()).map((item) => ({
    name: formatDay(item.date),
    revenue: Math.round(item.revenue * 100) / 100,
  }));

  /*
   * ----------------------------------------
   * TOP PRODUCTS
   * ----------------------------------------
   */

  const productMap = new Map<
    string,
    {
      id: string;
      name: string;
      sales: number;
      revenue: number;
    }
  >();

  for (const order of orders) {
    if (
      order.status === "Cancelled" ||
      order.status === "Pending"
    ) {
      continue;
    }

    for (const item of order.items) {
      const product = item.product;

      const existing = productMap.get(product.id);

      if (existing) {
        existing.sales += item.quantity;
        existing.revenue += Number(item.price) * item.quantity;
      } else {
        productMap.set(product.id, {
          id: product.id,
          name: product.name,
          sales: item.quantity,
          revenue: Number(item.price) * item.quantity,
        });
      }
    }
  }

  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((product) => ({
      id: product.id,
      name: product.name,
      sales: product.sales,
      revenue: `$${product.revenue.toFixed(2)}`,
    }));

  /*
   * ----------------------------------------
   * RECENT ORDERS
   * ----------------------------------------
   */

  const recentOrders = orders.slice(0, 8).map((order) => ({
    id: order.externalOrderId,
    customer: order.customerEmail,
    status: order.status,
    total: `$${Number(order.total).toFixed(2)}`,
  }));

  return {
    salesData,
    topProducts,
    recentOrders,
  };
}