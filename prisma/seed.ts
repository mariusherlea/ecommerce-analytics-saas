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
   * Create 250 orders over the last 90 days.
   */
  const orders: {
    id: string;
    customerEmail: string;
  }[] = [];

  let totalRevenue = 0;

  for (let i = 0; i < 250; i++) {
    /**
     * Distribution:
     *
     * Older dates -> fewer orders
     * Recent dates -> more orders
     *
     * This creates a positive trend that we can later
     * test with forecasting.
     */
    const progress = i / 249;

    const baseDaysAgo = Math.floor(90 - progress * 88);

    /**
     * Add some randomness around the date.
     */
    const dayVariation = randomInt(-2, 2);

    const days = Math.max(
      0,
      Math.min(89, baseDaysAgo + dayVariation)
    );

    /**
     * Weekends get slightly more activity.
     */
    const date = daysAgo(days);

    const dayOfWeek = date.getDay();

    let weekendMultiplier = 1;

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendMultiplier = 1.15;
    }

    /**
     * Determine customer.
     *
     * First 100 orders guarantee that every customer
     * appears at least once.
     */
    const customer =
      i < customers.length
        ? customers[i]
        : customers[randomInt(0, customers.length - 1)];

    /**
     * 1–3 items per order.
     */
    const itemCount = randomInt(1, 3);

    const selectedProducts = new Set<string>();

    while (selectedProducts.size < itemCount) {
      selectedProducts.add(pickProduct().id);
    }

    const orderProducts = Array.from(selectedProducts).map(
      (productId) => {
        const product = products.find(
          (item) => item.id === productId
        )!;

        return {
          product,
          quantity: randomInt(1, 3),
        };
      }
    );

    /**
     * Calculate real order total from products.
     */
    const total = orderProducts.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    /**
     * Order status distribution.
     */
    const statusRoll = random();

    let status: "Paid" | "Shipped" | "Pending" | "Cancelled";

    if (statusRoll < 0.65) {
      status = "Paid";
    } else if (statusRoll < 0.90) {
      status = "Shipped";
    } else if (statusRoll < 0.97) {
      status = "Pending";
    } else {
      status = "Cancelled";
    }

    /**
     * Cancelled orders shouldn't contribute to revenue.
     */
    if (status !== "Cancelled") {
      totalRevenue += total;
    }

    /**
     * Slightly increase order value over time.
     * This gives forecasting algorithms something meaningful
     * to detect.
     */
    const growthFactor = 1 + progress * 0.18;

    const adjustedTotal =
      Math.round(total * weekendMultiplier * growthFactor * 100) / 100;

    const order = await prisma.order.create({
      data: {
        externalOrderId: `SP-${String(1001 + i)}`,
        customerEmail: customer.email,
        total: adjustedTotal,
        status,
        storeId: store.id,
        createdAt: date,
      },
    });

    orders.push({
      id: order.id,
      customerEmail: customer.email,
    });

    /**
     * Create order items.
     *
     * We keep item prices equal to the product price.
     */
    await prisma.orderItem.createMany({
      data: orderProducts.map((item) => ({
        orderId: order.id,
        productId: item.product.id,
        quantity: item.quantity,
        price: Number(item.product.price),
      })),
    });
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