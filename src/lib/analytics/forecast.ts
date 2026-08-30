import { db } from "@/lib/db";

export type WeekdaySeasonality = {
  day: string;
  averageRevenue: number;
  index: number;
};

export type ForecastPoint = {
  date: string;
  revenue: number | null;
  forecast: number | null;
};

export type ForecastMetrics = {
  mae: number;
  mape: number;
  wape: number;
  sampleSize: number;
};

export type ForecastModelComparison = {
  baseline: ForecastMetrics;
  seasonal: ForecastMetrics;
  selectedModel: "baseline" | "seasonal";
};

export type RevenueForecast = {
  history: ForecastPoint[];
  forecast: ForecastPoint[];

  trend: "growing" | "declining" | "stable";
  growthRate: number;
  averageDailyRevenue: number;

  seasonality: WeekdaySeasonality[];

  backtest: ForecastMetrics;

  modelComparison: ForecastModelComparison;
};

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const result = new Date(date);

  result.setUTCDate(
    result.getUTCDate() + days
  );

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

/*
 * ----------------------------------------
 * LINEAR REGRESSION
 * ----------------------------------------
 */

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
    values.reduce(
      (sum, value) => sum + value,
      0
    ) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < values.length; i++) {
    const value = values[i];

    if (value === undefined) {
      continue;
    }

    numerator +=
      (i - xMean) *
      (value - yMean);

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

/*
 * ----------------------------------------
 * WEEKDAY SEASONALITY
 * ----------------------------------------
 */

function calculateWeekdaySeasonality(
  dates: Date[],
  revenues: number[]
): WeekdaySeasonality[] {
  const weekdayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const weekdayTotals =
    new Array(7).fill(0);

  const weekdayCounts =
    new Array(7).fill(0);

  for (let i = 0; i < dates.length; i++) {
  const date = dates[i];
  const revenue = revenues[i];

  if (date === undefined || revenue === undefined) {
    continue;
  }

  const weekday = date.getUTCDay();

  weekdayTotals[weekday] += revenue;
  
    weekdayCounts[weekday] += 1;
  }

  const overallAverage =
    revenues.length > 0
      ? revenues.reduce(
          (sum, value) =>
            sum + value,
          0
        ) / revenues.length
      : 0;

  return weekdayNames.map(
    (day, index) => {
      const averageRevenue =
        weekdayCounts[index] > 0
          ? weekdayTotals[index] /
            weekdayCounts[index]
          : 0;

      const seasonalIndex =
        overallAverage === 0
          ? 1
          : averageRevenue /
            overallAverage;

      return {
        day,

        averageRevenue: Number(
          averageRevenue.toFixed(2)
        ),

        index: Number(
          seasonalIndex.toFixed(3)
        ),
      };
    }
  );
}

/*
 * ----------------------------------------
 * GET SEASONALITY INDEX
 * ----------------------------------------
 */

function getSeasonalityIndex(
  date: Date,
  seasonality: WeekdaySeasonality[]
) {
  const weekdayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const day =
    weekdayNames[date.getUTCDay()];

  return (
    seasonality.find(
      (item) =>
        item.day === day
    )?.index ?? 1
  );
}

/*
 * ----------------------------------------
 * ERROR METRICS
 * ----------------------------------------
 */

function calculateMetrics(
  actual: number[],
  predicted: number[]
): ForecastMetrics {
  if (
    actual.length === 0 ||
    predicted.length === 0
  ) {
    return {
      mae: 0,
      mape: 0,
      wape: 0,
      sampleSize: 0,
    };
  }

 const errors = actual.map(
  (value, index) => {
    const prediction = predicted[index];

    if (prediction === undefined) {
      return 0;
    }

    return Math.abs(
      value - prediction
    );
  }
);
  /*
   * MAE
   */

  const mae =
    errors.reduce(
      (sum, error) =>
        sum + error,
      0
    ) / errors.length;

  /*
   * MAPE
   *
   * Ignore actual === 0 because
   * percentage error is undefined.
   */

  const percentageErrors: number[] = [];

for (let i = 0; i < actual.length; i++) {
  const actualValue = actual[i];
  const predictedValue = predicted[i];

  if (
    actualValue === undefined ||
    predictedValue === undefined ||
    actualValue === 0
  ) {
    continue;
  }

  percentageErrors.push(
    Math.abs(
      (actualValue - predictedValue) /
        actualValue
    )
  );
}

  const mape =
    percentageErrors.length > 0
      ? (percentageErrors.reduce(
          (sum, value) =>
            sum + value,
          0
        ) /
          percentageErrors.length) *
        100
      : 0;

  /*
   * WAPE
   */

  const totalAbsoluteError =
    errors.reduce(
      (sum, error) =>
        sum + error,
      0
    );

  const totalActual =
    actual.reduce(
      (sum, value) =>
        sum + Math.abs(value),
      0
    );

  const wape =
    totalActual === 0
      ? 0
      : (totalAbsoluteError /
          totalActual) *
        100;

  return {
    mae: Number(
      mae.toFixed(2)
    ),

    mape: Number(
      mape.toFixed(2)
    ),

    wape: Number(
      wape.toFixed(2)
    ),

    sampleSize:
      actual.length,
  };
}

/*
 * ----------------------------------------
 * BASELINE BACKTEST
 * ----------------------------------------
 */

function backtestBaseline(
  dates: Date[],
  revenues: number[],
  testDays = 14
): ForecastMetrics {
  if (
    revenues.length <= testDays ||
    revenues.length < 10
  ) {
    return {
      mae: 0,
      mape: 0,
      wape: 0,
      sampleSize: 0,
    };
  }

  const trainingValues =
    revenues.slice(
      0,
      -testDays
    );

  const actualValues =
    revenues.slice(
      -testDays
    );

  const {
    slope,
    intercept,
  } = linearRegression(
    trainingValues
  );

  const predictions =
    actualValues.map(
      (_, index) => {
        const x =
          trainingValues.length +
          index;

        return Math.max(
          0,
          intercept +
            slope * x
        );
      }
    );

  return calculateMetrics(
    actualValues,
    predictions
  );
}

/*
 * ----------------------------------------
 * SEASONAL BACKTEST
 * ----------------------------------------
 */

function backtestSeasonal(
  dates: Date[],
  revenues: number[],
  testDays = 14
): ForecastMetrics {
  if (
    revenues.length <= testDays ||
    revenues.length < 10
  ) {
    return {
      mae: 0,
      mape: 0,
      wape: 0,
      sampleSize: 0,
    };
  }

  const trainingValues =
    revenues.slice(
      0,
      -testDays
    );

  const trainingDates =
    dates.slice(
      0,
      -testDays
    );

  const actualValues =
    revenues.slice(
      -testDays
    );

  const actualDates =
    dates.slice(
      -testDays
    );

  /*
   * Seasonality must be calculated
   * ONLY from training data.
   *
   * This prevents data leakage.
   */

  const trainingSeasonality =
    calculateWeekdaySeasonality(
      trainingDates,
      trainingValues
    );

  const {
    slope,
    intercept,
  } = linearRegression(
    trainingValues
  );

  const predictions =
    actualValues.map(
      (_, index) => {
        const x =
          trainingValues.length +
          index;

        const baseline =
          Math.max(
            0,
            intercept +
              slope * x
          );

       const actualDate = actualDates[index];

if (actualDate === undefined) {
  return 0;
}

const seasonalIndex =
  getSeasonalityIndex(
    actualDate,
    trainingSeasonality
  );

        return Math.max(
          0,
          baseline *
            seasonalIndex
        );
      }
    );

  return calculateMetrics(
    actualValues,
    predictions
  );
}

/*
 * ----------------------------------------
 * MAIN FORECAST
 * ----------------------------------------
 */

export async function getRevenueForecast(
  storeId: string,
  historyDays = 90,
  forecastDays = 30
): Promise<RevenueForecast> {
  const today =
    startOfUTCDate(
      new Date()
    );

  const historyStart =
    addDays(
      today,
      -(historyDays - 1)
    );

  const orders =
    await db.order.findMany({
      where: {
        storeId,

        createdAt: {
          gte: historyStart,
          lt: addDays(
            today,
            1
          ),
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
   * ----------------------------------------
   * DAILY REVENUE
   * ----------------------------------------
   */

  const dailyRevenue =
    new Map<string, number>();

  for (
    let i = 0;
    i < historyDays;
    i++
  ) {
    const date =
      addDays(
        historyStart,
        i
      );

    dailyRevenue.set(
      formatDate(date),
      0
    );
  }

  for (const order of orders) {
    const date =
      formatDate(
        startOfUTCDate(
          order.createdAt
        )
      );

    if (
      !dailyRevenue.has(
        date
      )
    ) {
      continue;
    }

    const current =
      dailyRevenue.get(
        date
      ) ?? 0;

    dailyRevenue.set(
      date,
      current +
        Number(order.total)
    );
  }

  const dates =
    Array.from(
      dailyRevenue.keys()
    ).map(
      (date) =>
        new Date(
          `${date}T00:00:00Z`
        )
    );

  const historyValues =
    Array.from(
      dailyRevenue.values()
    );

  /*
   * ----------------------------------------
   * AVERAGE
   * ----------------------------------------
   */

  const totalRevenue =
    historyValues.reduce(
      (sum, value) =>
        sum + value,
      0
    );

  const averageDailyRevenue =
    historyValues.length > 0
      ? totalRevenue /
        historyValues.length
      : 0;

  /*
   * ----------------------------------------
   * SEASONALITY
   * ----------------------------------------
   */

  const seasonality =
    calculateWeekdaySeasonality(
      dates,
      historyValues
    );

  /*
   * ----------------------------------------
   * LINEAR REGRESSION
   * ----------------------------------------
   */

  const {
    slope,
    intercept,
  } = linearRegression(
    historyValues
  );

  /*
   * ----------------------------------------
   * TREND
   * ----------------------------------------
   */

  const relativeSlope =
    averageDailyRevenue === 0
      ? 0
      : (slope /
          averageDailyRevenue) *
        100;

  let trend:
    RevenueForecast["trend"];

  if (
    relativeSlope > 0.15
  ) {
    trend = "growing";
  } else if (
    relativeSlope < -0.15
  ) {
    trend = "declining";
  } else {
    trend = "stable";
  }

  /*
   * ----------------------------------------
   * GROWTH RATE
   * ----------------------------------------
   */

  const firstPredicted =
    intercept;

  const lastPredicted =
    intercept +
    slope *
      (historyValues.length - 1);

  const growthRate =
    firstPredicted === 0
      ? 0
      : ((lastPredicted -
          firstPredicted) /
          Math.abs(
            firstPredicted
          )) *
        100;

  /*
   * ----------------------------------------
   * MODEL BACKTEST
   * ----------------------------------------
   */

  const baselineMetrics =
    backtestBaseline(
      dates,
      historyValues,
      14
    );

  const seasonalMetrics =
    backtestSeasonal(
      dates,
      historyValues,
      14
    );

  /*
   * WAPE is the primary metric
   * for model selection.
   */

  const selectedModel: "baseline" | "seasonal" =
  seasonalMetrics.mae < baselineMetrics.mae
    ? "seasonal"
    : "baseline";

  const modelComparison = {
    baseline:
      baselineMetrics,

    seasonal:
      seasonalMetrics,

    selectedModel,
  };

  /*
   * Keep the existing public
   * backtest field.
   *
   * It now represents the
   * selected model.
   */

  const backtest =
    selectedModel ===
    "seasonal"
      ? seasonalMetrics
      : baselineMetrics;

  /*
   * ----------------------------------------
   * HISTORY
   * ----------------------------------------
   */

  const history:
    ForecastPoint[] =
    Array.from(
      dailyRevenue.entries()
    ).map(
      ([date, revenue]) => ({
        date,

        revenue: Number(
          revenue.toFixed(2)
        ),

        forecast: null,
      })
    );

  /*
   * ----------------------------------------
   * FUTURE FORECAST
   * ----------------------------------------
   */

  const forecast:
    ForecastPoint[] = [];

  for (
    let i = 1;
    i <= forecastDays;
    i++
  ) {
    const x =
      historyValues.length -
      1 +
      i;

    /*
     * Baseline regression forecast.
     */

    const baselineForecast =
      Math.max(
        0,
        intercept +
          slope * x
      );

    const date =
      addDays(
        today,
        i
      );

    /*
     * Apply weekday seasonality
     * only when the seasonal
     * model wins the backtest.
     */

    let predictedRevenue =
      baselineForecast;

    if (
      selectedModel ===
      "seasonal"
    ) {
      const seasonalIndex =
        getSeasonalityIndex(
          date,
          seasonality
        );

      predictedRevenue =
        Math.max(
          0,
          baselineForecast *
            seasonalIndex
        );
    }

    forecast.push({
      date:
        formatDate(date),

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

    averageDailyRevenue:
      Number(
        averageDailyRevenue.toFixed(
          2
        )
      ),

    seasonality,

    backtest,

    modelComparison,
  };
}