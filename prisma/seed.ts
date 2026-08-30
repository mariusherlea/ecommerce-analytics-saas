//prisma//seed.ts
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Deterministic pseudo-random generator.
 * This gives us realistic but reproducible demo data.
 */
let seed = 42;

function random() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function randomInt(min: number, max: number) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pick<T>(items: T[]) {
  return items[Math.floor(random() * items.length)];
}

function daysAgo(days: number, hour?: number) {
  const date = new Date();

  date.setDate(date.getDate() - days);

  date.setHours(
    hour ?? randomInt(8, 20),
    randomInt(0, 59),
    randomInt(0, 59),
    0
  );

  return date;
}

/**
 * Products
 */
const productDefinitions = [
  ["Premium T-Shirt", 30],
  ["Minimal Hoodie", 50],
  ["Black Cap", 20],
  ["Classic Sneakers", 100],
  ["Urban Jacket", 120],
  ["Basic Sweatshirt", 60],
  ["Slim Jeans", 75],
  ["Classic Polo", 45],
  ["Sport Shorts", 35],
  ["Running Shoes", 90],
  ["Cotton Socks", 12],
  ["Leather Belt", 28],
  ["Canvas Backpack", 55],
  ["Travel Bag", 80],
  ["Minimal Wallet", 25],
  ["Classic Watch", 150],
  ["Sport Watch", 180],
  ["Sunglasses", 65],
  ["Winter Beanie", 18],
  ["Leather Gloves", 40],
  ["Oversized T-Shirt", 35],
  ["Zip Hoodie", 65],
  ["Cargo Pants", 70],
  ["Running Shorts", 32],
  ["Training Shirt", 38],
  ["Windbreaker", 95],
  ["Classic Boots", 110],
  ["Casual Sneakers", 85],
  ["Leather Backpack", 125],
  ["Premium Jacket", 180],
] as const;

/**
 * Customer pool
 */
const customerNames = [
  "Ana",
  "Dan",
  "Elena",
  "Alex",
  "Maria",
  "Andrei",
  "Ioana",
  "Cristian",
  "Laura",
  "Mihai",
  "Diana",
  "Robert",
  "Sofia",
  "Adrian",
  "Gabriela",
  "Paul",
  "Monica",
  "Victor",
  "Roxana",
  "Florin",
  "Daniel",
  "Alina",
  "George",
  "Bianca",
  "Stefan",
  "Oana",
  "Catalin",
  "Irina",
  "Bogdan",
  "Simona",
  "Alexandra",
  "Vlad",
  "Claudia",
  "Marian",
  "Denisa",
  "Ionut",
  "Cristina",
  "Radu",
  "Andreea",
  "Lucian",
  "Mihaela",
  "Sorin",
  "Raluca",
  "Emil",
  "Larisa",
  "Nicolae",
  "Teodora",
  "Tudor",
  "Elisa",
  "Matei",
  "Carla",
  "Darius",
  "Mara",
  "Sebastian",
  "Nicoleta",
  "Patrick",
  "Emma",
  "Oliver",
  "Lucas",
  "Amelia",
  "Liam",
  "Noah",
  "Olivia",
  "James",
  "Emily",
  "William",
  "Sophia",
  "Henry",
  "Charlotte",
  "Jack",
  "Isabella",
  "Leo",
  "Mia",
  "Oscar",
  "Ella",
  "Harry",
  "Grace",
  "Charlie",
  "Chloe",
  "Thomas",
  "Lily",
  "Jacob",
  "Sophie",
  "Daniel",
  "Ruby",
  "Max",
  "Alice",
  "Ben",
  "Eva",
  "Sam",
  "Lucy",
  "Adam",
  "Ella",
  "Ryan",
  "Megan",
  "Alex",
  "Sarah",
  "Tom",
  "Anna",
];

async function main() {
  console.log("🌱 Starting StorePulse demo seed...");

  /**
   * Clean database
   */
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  /**
   * Demo user
   */
  const hashedPassword = await bcrypt.hash("123456", 12);

  const user = await prisma.user.create({
    data: {
      name: "Mario",
      email: "mario@example.com",
      password: hashedPassword,
      role: "user",
      subscriptionStatus: "free",
    },
  });

  /**
   * Demo store
   */
  const store = await prisma.store.create({
    data: {
      name: "StorePulse Demo Store",
      platform: "Next.js + Strapi",
      userId: user.id,
    },
  });

  /**
   * Create products
   */
  const products = await prisma.$transaction(
    productDefinitions.map(([name, price], index) =>
      prisma.product.create({
        data: {
          name,
          slug: name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
          sku: `SP-${String(index + 1).padStart(3, "0")}`,
          price,
          stock: randomInt(25, 250),
          storeId: store.id,
        },
      })
    )
  );

  console.log(`✅ Created ${products.length} products`);

  /**
   * Create 100 customers.
   *
   * We use distinct emails and reuse them across orders
   * so StorePulse can calculate unique customers.
   */
  const customers = customerNames.map((name, index) => ({
    name,
    email: `${name.toLowerCase()}${index + 1}@example.com`,
  }));

  /**
   * Product popularity.
   *
   * Lower index = more popular.
   * This gives us useful data for product analytics.
   */
  const productWeights = products.map((_, index) => {
    if (index < 5) return 10;
    if (index < 10) return 7;
    if (index < 20) return 4;
    return 2;
  });

  function pickProduct() {
    const totalWeight = productWeights.reduce(
      (sum, weight) => sum + weight,
      0
    );

    let value = random() * totalWeight;

    for (let i = 0; i < products.length; i++) {
      value -= productWeights[i];

      if (value <= 0) {
        return products[i];
      }
    }

    return products[0];
  }

 /**
 * Create orders over the last 90 days.
 *
 * The dataset intentionally contains:
 * - a positive long-term trend
 * - weekday seasonality
 * - daily randomness
 * - realistic order values
 *
 * This gives StorePulse useful data for:
 * quantitative analytics, backtesting and forecasting.
 */

const orders: {
  id: string;
  customerEmail: string;
}[] = [];

let totalRevenue = 0;

const today = new Date();

today.setHours(0, 0, 0, 0);

const startDate = new Date(today);

startDate.setDate(
  startDate.getDate() - 89
);

/*
 * Weekday seasonality.
 *
 * Sunday = 0
 * Monday = 1
 * ...
 * Saturday = 6
 *
 * Weekend and end-of-week activity is intentionally
 * stronger so the forecasting model has a pattern
 * to discover.
 */
const weekdayMultiplier: Record<
  number,
  number
> = {
  0: 1.05, // Sunday
  1: 0.85, // Monday
  2: 0.90, // Tuesday
  3: 0.95, // Wednesday
  4: 1.10, // Thursday
  5: 1.15, // Friday
  6: 1.25, // Saturday
};

/*
 * Generate approximately 3–6 orders per day.
 *
 * This guarantees that every day has data,
 * which is important for time-series analysis.
 */
let orderIndex = 0;

for (let dayIndex = 0; dayIndex < 90; dayIndex++) {
  const date = new Date(startDate);

  date.setDate(
    startDate.getDate() + dayIndex
  );

  const dayOfWeek = date.getDay();

  const seasonality =
    weekdayMultiplier[dayOfWeek];

  /*
   * Long-term growth.
   *
   * Revenue gradually increases over the
   * 90-day period.
   */
  const progress = dayIndex / 89;

  const growthFactor =
    0.85 + progress * 0.30;

  /*
   * Daily demand randomness.
   *
   * Keeps the dataset from looking artificially
   * perfect while preserving the overall pattern.
   */
  const dailyNoise =
    0.85 + random() * 0.30;

  /*
   * Number of orders for this day.
   */
  const baseOrders = randomInt(3, 5);

  const ordersToday = Math.max(
    1,
    Math.round(
      baseOrders *
        seasonality *
        dailyNoise
    )
  );

  for (
    let dailyOrder = 0;
    dailyOrder < ordersToday;
    dailyOrder++
  ) {
    /*
     * Determine customer.
     *
     * The first customers are guaranteed to appear
     * at least once.
     */
    const customer =
      orderIndex < customers.length
        ? customers[orderIndex]
        : customers[
            randomInt(
              0,
              customers.length - 1
            )
          ];

    /*
     * 1–3 products per order.
     */
    const itemCount = randomInt(1, 3);

    const selectedProducts =
      new Set<string>();

    while (
      selectedProducts.size <
      itemCount
    ) {
      selectedProducts.add(
        pickProduct().id
      );
    }

    const orderProducts =
      Array.from(
        selectedProducts
      ).map((productId) => {
        const product =
          products.find(
            (item) =>
              item.id === productId
          )!;

        return {
          product,
          quantity: randomInt(1, 3),
        };
      });

    /*
     * Base order value.
     */
    const baseTotal =
      orderProducts.reduce(
        (sum, item) =>
          sum +
          Number(item.product.price) *
            item.quantity,
        0
      );

    /*
     * Add realistic variation to order value.
     */
    const orderNoise =
      0.90 + random() * 0.25;

    const adjustedTotal =
      Math.round(
        baseTotal *
          growthFactor *
          orderNoise *
          100
      ) / 100;

    /*
     * Order status distribution.
     */
    const statusRoll = random();

    let status:
      | "Paid"
      | "Shipped"
      | "Pending"
      | "Cancelled";

    if (statusRoll < 0.65) {
      status = "Paid";
    } else if (statusRoll < 0.90) {
      status = "Shipped";
    } else if (statusRoll < 0.97) {
      status = "Pending";
    } else {
      status = "Cancelled";
    }

    /*
     * Revenue excludes cancelled orders.
     */
    if (status !== "Cancelled") {
      totalRevenue += adjustedTotal;
    }

    /*
     * Random time during the day.
     */
    const orderDate = new Date(date);

    orderDate.setHours(
      randomInt(8, 20),
      randomInt(0, 59),
      randomInt(0, 59),
      0
    );

    const order =
      await prisma.order.create({
        data: {
          externalOrderId:
            `SP-${String(
              1001 + orderIndex
            )}`,

          customerEmail:
            customer.email,

          total: adjustedTotal,

          status,

          storeId: store.id,

          createdAt: orderDate,
        },
      });

    orders.push({
      id: order.id,
      customerEmail:
        customer.email,
    });

    /*
     * Create order items.
     */
    await prisma.orderItem.createMany({
      data: orderProducts.map(
        (item) => ({
          orderId: order.id,
          productId:
            item.product.id,
          quantity:
            item.quantity,
          price:
            Number(
              item.product.price
            ),
        })
      ),
    });

    orderIndex++;
  }
}


  /**
   * Final statistics
   */
  const paidOrders = await prisma.order.count({
    where: {
      storeId: store.id,
      status: {
        in: ["Paid", "Shipped"],
      },
    },
  });

  const uniqueCustomers = await prisma.order.findMany({
    where: {
      storeId: store.id,
    },
    select: {
      customerEmail: true,
    },
    distinct: ["customerEmail"],
  });

  console.log("");
  console.log("=================================");
  console.log("🚀 StorePulse Demo Dataset");
  console.log("=================================");
  console.log(`Products:          ${products.length}`);
  console.log(`Orders:            ${orders.length}`);
  console.log(`Customers:         ${uniqueCustomers.length}`);
  console.log(`Revenue orders:    ${paidOrders}`);
  console.log(
    `Approx. revenue:   $${totalRevenue.toFixed(2)}`
  );
  console.log("History:           90 days");
  console.log("=================================");
  console.log("");
  console.log("Demo login:");
  console.log("Email:    mario@example.com");
  console.log("Password: 123456");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });