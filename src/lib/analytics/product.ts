import { db } from "@/lib/db";

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getProductAnalytics(
  productId: string,
  storeId: string
) {
  const product = await db.product.findFirst({
    where: {
      id: productId,
      storeId,
    },
    select: {
      id: true,
      name: true,
      sku: true,
      price: true,
      stock: true,
      createdAt: true,
    },
  });

  if (!product) {
    return null;
  }

  const orderItems = await db.orderItem.findMany({
    where: {
      productId: product.id,
      order: {
        storeId,
        status: {
          not: "Cancelled",
        },
      },
    },
    select: {
      quantity: true,
      price: true,
      orderId: true,
      order: {
        select: {
          createdAt: true,
        },
      },
    },
  });

  const unitsSold = orderItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const revenue = orderItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  const orderCount = new Set(
    orderItems.map((item) => item.orderId)
  ).size;

  const averageOrderValue =
    orderCount > 0 ? revenue / orderCount : 0;

  // Last 30 days
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const startDate = new Date(today);
  startDate.setUTCDate(startDate.getUTCDate() - 29);

  const recentOrderItems = orderItems.filter(
    (item) => item.order.createdAt >= startDate
  );

  // Create all 30 days first so days without sales are included
  const salesMap = new Map<
    string,
    {
      revenue: number;
      unitsSold: number;
    }
  >();

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setUTCDate(date.getUTCDate() + i);

    salesMap.set(formatDate(date), {
      revenue: 0,
      unitsSold: 0,
    });
  }

  // Add product revenue and units sold for each day
  for (const item of recentOrderItems) {
    const dateKey = formatDate(item.order.createdAt);
    const itemRevenue = item.quantity * item.price;
    const current = salesMap.get(dateKey);

    if (current) {
      current.revenue += itemRevenue;
      current.unitsSold += item.quantity;
    }
  }

  const salesData = Array.from(salesMap.entries()).map(
    ([date, values]) => ({
      date,
      revenue: Number(values.revenue.toFixed(2)),
      unitsSold: values.unitsSold,
    })
  );

  return {
    product,
    metrics: {
      revenue,
      unitsSold,
      orderCount,
      averageOrderValue,
    },
    salesData,
  };
}