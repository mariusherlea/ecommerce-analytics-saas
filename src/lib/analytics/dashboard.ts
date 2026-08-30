//src/lib/analytics/dashboard.ts
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

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export async function getDashboardAnalytics(storeId: string) {
  const now = new Date();

  /*
   * ----------------------------------------
   * LAST 30 DAYS
   * ----------------------------------------
   */

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
   * VALID ORDERS
   * ----------------------------------------
   *
   * Cancelled and Pending orders are excluded
   * from revenue calculations.
   */

  const validOrders = orders.filter(
    (order) =>
      order.status !== "Cancelled" &&
      order.status !== "Pending"
  );

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

for (const order of validOrders) {
  const day = startOfDay(order.createdAt);
  const key = day.toISOString().slice(0, 10);

  const existing = salesMap.get(key);

  if (existing) {
    existing.revenue += Number(order.total);
  }
}

const salesData = Array.from(
  salesMap.values()
).map((item) => ({
  name: formatDay(item.date),
  revenue: Math.round(
    item.revenue * 100
  ) / 100,
}));

  /*
   * ----------------------------------------
   * BASIC ANALYTICS
   * ----------------------------------------
   */

  const totalRevenue = validOrders.reduce(
    (sum, order) =>
      sum + Number(order.total),
    0
  );

  const totalOrders = validOrders.length;

  const averageOrderValue =
    totalOrders > 0
      ? totalRevenue / totalOrders
      : 0;

/*
 * ----------------------------------------
 * WEEKDAY PERFORMANCE
 * ----------------------------------------
 */

const weekdayMap = new Map<
  string,
  {
    revenue: number;
    orders: number;
  }
>();

for (const day of WEEKDAYS) {
  weekdayMap.set(day, {
    revenue: 0,
    orders: 0,
  });
}

for (const order of validOrders) {
  const weekday =
    WEEKDAYS[order.createdAt.getDay()];

  if (!weekday) {
    continue;
  }

  const existing =
    weekdayMap.get(weekday);

  if (existing) {
    existing.revenue += Number(
      order.total
    );

    existing.orders += 1;
  }
}

const weekdayPerformance =
  WEEKDAYS.map((day) => {
    const data = weekdayMap.get(day);

    if (!data) {
      return {
        day,
        revenue: 0,
        orders: 0,
        averageOrderValue: 0,
      };
    }

    return {
      day,

      revenue: Number(
        data.revenue.toFixed(2)
      ),

      orders: data.orders,

      averageOrderValue:
        data.orders > 0
          ? Number(
              (
                data.revenue /
                data.orders
              ).toFixed(2)
            )
          : 0,
    };
  });
  /*
   * ----------------------------------------
   * BEST / WORST DAY
   * ----------------------------------------
   */

  const daysWithRevenue =
    weekdayPerformance.filter(
      (day) => day.orders > 0
    );

  const bestDay =
    daysWithRevenue.length > 0
      ? daysWithRevenue.reduce(
          (best, current) =>
            current.revenue >
            best.revenue
              ? current
              : best
        )
      : null;

  const worstDay =
    daysWithRevenue.length > 0
      ? daysWithRevenue.reduce(
          (worst, current) =>
            current.revenue <
            worst.revenue
              ? current
              : worst
        )
      : null;

  /*
   * ----------------------------------------
   * REVENUE TREND
   * ----------------------------------------
   *
   * Compare first 15 days with
   * last 15 days.
   */

  const firstHalfRevenue =
    salesData
      .slice(0, 15)
      .reduce(
        (sum, day) =>
          sum + day.revenue,
        0
      );

  const secondHalfRevenue =
    salesData
      .slice(15)
      .reduce(
        (sum, day) =>
          sum + day.revenue,
        0
      );

  const growthRate =
    firstHalfRevenue === 0
      ? 0
      : ((secondHalfRevenue -
          firstHalfRevenue) /
          firstHalfRevenue) *
        100;

  const trend =
    growthRate > 5
      ? "growing"
      : growthRate < -5
      ? "declining"
      : "stable";

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

  for (const order of validOrders) {
    for (const item of order.items) {
      const product = item.product;

      const existing =
        productMap.get(product.id);

      if (existing) {
        existing.sales += item.quantity;

        existing.revenue +=
          Number(item.price) *
          item.quantity;
      } else {
        productMap.set(product.id, {
          id: product.id,
          name: product.name,
          sales: item.quantity,
          revenue:
            Number(item.price) *
            item.quantity,
        });
      }
    }
  }

  const topProducts =
    Array.from(productMap.values())
      .sort(
        (a, b) =>
          b.revenue - a.revenue
      )
      .slice(0, 5)
      .map((product) => ({
        id: product.id,
        name: product.name,
        sales: product.sales,
        revenue: `$${product.revenue.toFixed(
          2
        )}`,
      }));

  /*
   * ----------------------------------------
   * RECENT ORDERS
   * ----------------------------------------
   */

 const recentOrders =
  orders
    .slice(0, 8)
    .map((order) => ({
      id:
        order.externalOrderId ??
        order.id,

      customer:
        order.customerEmail,

      status: order.status,

      total: `$${Number(
        order.total
      ).toFixed(2)}`,
    }));

  /*
   * ----------------------------------------
   * RETURN
   * ----------------------------------------
   */

  return {
    salesData,
    topProducts,
    recentOrders,

    analytics: {
      totalRevenue: Number(
        totalRevenue.toFixed(2)
      ),

      totalOrders,

      averageOrderValue: Number(
        averageOrderValue.toFixed(2)
      ),

      growthRate: Number(
        growthRate.toFixed(2)
      ),

      trend,

      bestDay,

      worstDay,

      weekdayPerformance,
    },
  };
}