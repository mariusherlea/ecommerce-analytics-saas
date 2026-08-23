import { db } from "@/lib/db";

export type OverviewStats = {
  orders: {
    value: number;
    change: number;
    trend: "up" | "down";
  };
  revenue: {
    value: number;
    change: number;
    trend: "up" | "down";
  };
  customers: {
    value: number;
    change: number;
    trend: "up" | "down";
  };
  averageOrderValue: {
    value: number;
    change: number;
    trend: "up" | "down";
  };
};

function calculateChange(current: number, previous: number) {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
}

function getTrend(change: number): "up" | "down" {
  return change >= 0 ? "up" : "down";
}

export async function getOverviewStats(storeId: string) {
  const now = new Date();

  const currentStart = new Date(now);
  currentStart.setDate(currentStart.getDate() - 30);

  const previousStart = new Date(now);
  previousStart.setDate(previousStart.getDate() - 60);

  const [currentOrders, previousOrders] = await Promise.all([
    db.order.findMany({
      where: {
        storeId,
        createdAt: {
          gte: currentStart,
          lte: now,
        },
      },
      select: {
        total: true,
        customerEmail: true,
        status: true,
      },
    }),

    db.order.findMany({
      where: {
        storeId,
        createdAt: {
          gte: previousStart,
          lt: currentStart,
        },
      },
      select: {
        total: true,
        customerEmail: true,
        status: true,
      },
    }),
  ]);

  const validStatuses = ["Paid", "Shipped"];

  const currentValidOrders = currentOrders.filter((order) =>
    validStatuses.includes(order.status)
  );

  const previousValidOrders = previousOrders.filter((order) =>
    validStatuses.includes(order.status)
  );

  // ORDERS

  const currentOrderCount = currentValidOrders.length;
  const previousOrderCount = previousValidOrders.length;

  const ordersChange = calculateChange(
    currentOrderCount,
    previousOrderCount
  );

  // REVENUE

  const currentRevenue = currentValidOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const previousRevenue = previousValidOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const revenueChange = calculateChange(
    currentRevenue,
    previousRevenue
  );

  // CUSTOMERS

  const currentCustomers = new Set(
    currentValidOrders.map((order) => order.customerEmail)
  );

  const previousCustomers = new Set(
    previousValidOrders.map((order) => order.customerEmail)
  );

  const customerChange = calculateChange(
    currentCustomers.size,
    previousCustomers.size
  );

  // AVERAGE ORDER VALUE

  const currentAOV =
    currentOrderCount > 0
      ? currentRevenue / currentOrderCount
      : 0;

  const previousAOV =
    previousOrderCount > 0
      ? previousRevenue / previousOrderCount
      : 0;

  const aovChange = calculateChange(
    currentAOV,
    previousAOV
  );

  const stats: OverviewStats = {
    orders: {
      value: currentOrderCount,
      change: ordersChange,
      trend: getTrend(ordersChange),
    },

    revenue: {
      value: currentRevenue,
      change: revenueChange,
      trend: getTrend(revenueChange),
    },

    customers: {
      value: currentCustomers.size,
      change: customerChange,
      trend: getTrend(customerChange),
    },

    averageOrderValue: {
      value: currentAOV,
      change: aovChange,
      trend: getTrend(aovChange),
    },
  };

  return stats;
}