import { db } from "@/lib/db";

export type ForecastPoint = {
  date: string;
  revenue: number | null;
  forecast: number | null;
};

export type RevenueForecast = {
  history: ForecastPoint[];
  forecast: ForecastPoint[];
  trend: "growing" | "declining" | "stable";
  growthRate: number;
  averageDailyRevenue: number;
};

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function startOfUTCDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    )
  );
}

function linearRegression(values: number[]) {
  const n = values.length;

  if (n < 2) {
    return {
      slope: 0,
      intercept: values[0] ?? 0,
    };
  }

  const xMean = (n - 1) / 2;

  const yMean =
    values.reduce((sum, value) => sum + value, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator +=
      (i - xMean) * (values[i] - yMean);

    denominator +=
      (i - xMean) ** 2;
  }

  const slope =
    denominator === 0
      ? 0
      : numerator / denominator;

  const intercept =
    yMean - slope * xMean;

  return {
    slope,
    intercept,
  };
}

export async function getRevenueForecast(
  storeId: string,
  historyDays = 90,
  forecastDays = 30
): Promise<RevenueForecast> {
  /*
   * Today at UTC midnight.
   *
   * This gives us a clean daily boundary and prevents
   * the current day from accidentally appearing twice.
   */
  const today = startOfUTCDate(new Date());

  /*
   * First historical day.
   *
   * Example:
   * today = 2026-08-23
   * historyDays = 90
   *
   * history starts at 2026-05-26
   * and ends at 2026-08-23.
   */
  const historyStart = addDays(
    today,
    -(historyDays - 1)
  );

  const orders = await db.order.findMany({
    where: {
      storeId,
      createdAt: {
        gte: historyStart,
        lt: addDays(today, 1),
      },
      status: {
        not: "Cancelled",
      },
    },
    select: {
      total: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  /*
   * Build a complete daily time series.
   *
   * Days without orders are explicitly represented
   * as 0 revenue.
   */
  const dailyRevenue = new Map<string, number>();

  for (let i = 0; i < historyDays; i++) {
    const date = addDays(historyStart, i);

    dailyRevenue.set(
      formatDate(date),
      0
    );
  }

  /*
   * Add order revenue to the correct day.
   */
  for (const order of orders) {
    const date = formatDate(
      startOfUTCDate(order.createdAt)
    );

    if (!dailyRevenue.has(date)) {
      continue;
    }

    const current =
      dailyRevenue.get(date) ?? 0;

    dailyRevenue.set(
      date,
      current + Number(order.total)
    );
  }

  const historyValues =
    Array.from(dailyRevenue.values());

  /*
   * Average daily revenue.
   */
  const totalRevenue =
    historyValues.reduce(
      (sum, value) => sum + value,
      0
    );

  const averageDailyRevenue =
    historyValues.length > 0
      ? totalRevenue / historyValues.length
      : 0;

  /*
   * Linear regression.
   */
  const {
    slope,
    intercept,
  } = linearRegression(historyValues);

  /*
   * Relative slope.
   *
   * This tells us how strong the trend is compared
   * with the average daily revenue.
   */
  const relativeSlope =
    averageDailyRevenue === 0
      ? 0
      : (slope / averageDailyRevenue) * 100;

  let trend: RevenueForecast["trend"];

  if (relativeSlope > 0.15) {
    trend = "growing";
  } else if (relativeSlope < -0.15) {
    trend = "declining";
  } else {
    trend = "stable";
  }

  /*
   * Growth rate over the historical period.
   */
  const firstPredicted =
    intercept;

  const lastPredicted =
    intercept +
    slope * (historyValues.length - 1);

  const growthRate =
    firstPredicted === 0
      ? 0
      : ((lastPredicted - firstPredicted) /
          Math.abs(firstPredicted)) *
        100;

  /*
   * Historical points.
   */
  const history: ForecastPoint[] =
    Array.from(dailyRevenue.entries()).map(
      ([date, revenue]) => ({
        date,
        revenue: Number(revenue.toFixed(2)),
        forecast: null,
      })
    );

  /*
   * Forecast starts TOMORROW.
   *
   * This is the important correction:
   *
   * history ends on today
   * forecast starts on tomorrow
   */
  const forecast: ForecastPoint[] = [];

  for (let i = 1; i <= forecastDays; i++) {
    /*
     * The first forecast point corresponds
     * to the next x value after the last
     * historical observation.
     */
    const x =
      historyValues.length - 1 + i;

    const predictedRevenue =
      Math.max(
        0,
        intercept + slope * x
      );

    const date = addDays(today, i);

    forecast.push({
      date: formatDate(date),
      revenue: null,
      forecast: Number(
        predictedRevenue.toFixed(2)
      ),
    });
  }

  return {
    history,
    forecast,
    trend,
    growthRate: Number(
      growthRate.toFixed(2)
    ),
    averageDailyRevenue: Number(
      averageDailyRevenue.toFixed(2)
    ),
  };
}