//sr/lib/analytics/product.ts
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

  // All-time product metrics
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

  // Current and previous 30-day periods
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const currentPeriodStart = new Date(today);
  currentPeriodStart.setUTCDate(
    currentPeriodStart.getUTCDate() - 29
  );

  const previousPeriodStart = new Date(currentPeriodStart);
  previousPeriodStart.setUTCDate(
    previousPeriodStart.getUTCDate() - 30
  );

  const previousPeriodEnd = new Date(currentPeriodStart);
  previousPeriodEnd.setUTCMilliseconds(
    previousPeriodEnd.getUTCMilliseconds() - 1
  );

  // Current 30-day period
  const recentOrderItems = orderItems.filter(
    (item) => item.order.createdAt >= currentPeriodStart
  );

  // Previous 30-day period
  const previousOrderItems = orderItems.filter(
    (item) =>
      item.order.createdAt >= previousPeriodStart &&
      item.order.createdAt <= previousPeriodEnd
  );

  // Current 30-day period metrics
  const currentUnitsSold = recentOrderItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const currentRevenue = recentOrderItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  const currentOrderCount = new Set(
    recentOrderItems.map((item) => item.orderId)
  ).size;

  const currentAverageOrderValue =
    currentOrderCount > 0
      ? currentRevenue / currentOrderCount
      : 0;

  // Store revenue for the current 30-day period
  const storeCurrentPeriodRevenue = await db.order.aggregate({
    where: {
      storeId,
      status: {
        not: "Cancelled",
      },
      createdAt: {
        gte: currentPeriodStart,
      },
    },
    _sum: {
      total: true,
    },
  });

  const storeRevenue =
    storeCurrentPeriodRevenue._sum.total ?? 0;

  const revenueContribution =
    storeRevenue > 0
      ? (currentRevenue / storeRevenue) * 100
      : 0;

        // Product ranking for the current 30-day period
  const storeProducts = await db.product.findMany({
    where: {
      storeId,
    },
    select: {
      id: true,
    },
  });

  const storeOrderItems = await db.orderItem.findMany({
    where: {
      order: {
        storeId,
        status: {
          not: "Cancelled",
        },
        createdAt: {
          gte: currentPeriodStart,
        },
      },
    },
    select: {
      productId: true,
      quantity: true,
      price: true,
      orderId: true,
    },
  });

  const productRankingMap = new Map<
    string,
    {
      revenue: number;
      unitsSold: number;
      orderIds: Set<string>;
    }
  >();

  for (const storeProduct of storeProducts) {
    productRankingMap.set(storeProduct.id, {
      revenue: 0,
      unitsSold: 0,
      orderIds: new Set(),
    });
  }

  for (const item of storeOrderItems) {
    const current = productRankingMap.get(item.productId);

    if (!current) {
      continue;
    }

    current.revenue += item.quantity * item.price;
    current.unitsSold += item.quantity;
    current.orderIds.add(item.orderId);
  }

  const rankedProducts = Array.from(
    productRankingMap.entries()
  ).map(([productId, values]) => ({
    productId,
    revenue: values.revenue,
    unitsSold: values.unitsSold,
    orderCount: values.orderIds.size,
  }));

  const revenueRanking = [...rankedProducts].sort(
    (a, b) => b.revenue - a.revenue
  );

  const unitsRanking = [...rankedProducts].sort(
    (a, b) => b.unitsSold - a.unitsSold
  );

  const ordersRanking = [...rankedProducts].sort(
    (a, b) => b.orderCount - a.orderCount
  );

  const productCount = rankedProducts.length;

  const revenueRank =
    revenueRanking.findIndex(
      (item) => item.productId === product.id
    ) + 1;

  const unitsSoldRank =
    unitsRanking.findIndex(
      (item) => item.productId === product.id
    ) + 1;

  const ordersRank =
    ordersRanking.findIndex(
      (item) => item.productId === product.id
    ) + 1;

  // Previous 30-day period metrics
  const previousUnitsSold = previousOrderItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const previousRevenue = previousOrderItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  const previousOrderCount = new Set(
    previousOrderItems.map((item) => item.orderId)
  ).size;

  const previousAverageOrderValue =
    previousOrderCount > 0
      ? previousRevenue / previousOrderCount
      : 0;


  // Create all 30 current-period days
  const salesMap = new Map<
    string,
    {
      revenue: number;
      unitsSold: number;
    }
  >();

  for (let i = 0; i < 30; i++) {
    const date = new Date(currentPeriodStart);
    date.setUTCDate(date.getUTCDate() + i);

    salesMap.set(formatDate(date), {
      revenue: 0,
      unitsSold: 0,
    });
  }

  // Add revenue and units sold for each day
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

    // All-time metrics
    metrics: {
      revenue,
      unitsSold,
      orderCount,
      averageOrderValue,
    },

    // Current 30-day period
    currentPeriod: {
      revenue: currentRevenue,
      unitsSold: currentUnitsSold,
      orderCount: currentOrderCount,
      averageOrderValue: currentAverageOrderValue,
    },

      storeContribution: {
      storeRevenue,
      productRevenue: currentRevenue,
      revenuePercentage: revenueContribution,
    },

 productRanking: {
      revenueRank,
      unitsSoldRank,
      ordersRank,
      totalProducts: productCount,
    },

    // Previous 30-day period
    previousPeriod: {
      revenue: previousRevenue,
      unitsSold: previousUnitsSold,
      orderCount: previousOrderCount,
      averageOrderValue: previousAverageOrderValue,
    },

    salesData,
  };
}