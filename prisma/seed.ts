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

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

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

  const store = await prisma.store.create({
    data: {
      name: "StorePulse Demo Store",
      platform: "Next.js + Strapi",
      userId: user.id,
    },
  });

  const products = await prisma.$transaction([
    prisma.product.create({
      data: {
        name: "Premium T-Shirt",
        slug: "premium-t-shirt",
        sku: "TSHIRT-001",
        price: 30,
        stock: 120,
        storeId: store.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Minimal Hoodie",
        slug: "minimal-hoodie",
        sku: "HOODIE-001",
        price: 50,
        stock: 80,
        storeId: store.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Black Cap",
        slug: "black-cap",
        sku: "CAP-001",
        price: 20,
        stock: 150,
        storeId: store.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Classic Sneakers",
        slug: "classic-sneakers",
        sku: "SNKR-001",
        price: 100,
        stock: 45,
        storeId: store.id,
      },
    }),
  ]);

  const order1 = await prisma.order.create({
    data: {
      externalOrderId: "1001",
      customerEmail: "ana@example.com",
      total: 110,
      status: "Paid",
      storeId: store.id,
      createdAt: new Date("2026-03-02T10:00:00Z"),
    },
  });

  const order2 = await prisma.order.create({
    data: {
      externalOrderId: "1002",
      customerEmail: "dan@example.com",
      total: 50,
      status: "Pending",
      storeId: store.id,
      createdAt: new Date("2026-03-03T12:30:00Z"),
    },
  });

  const order3 = await prisma.order.create({
    data: {
      externalOrderId: "1003",
      customerEmail: "elena@example.com",
      total: 120,
      status: "Paid",
      storeId: store.id,
      createdAt: new Date("2026-03-04T15:15:00Z"),
    },
  });

  const order4 = await prisma.order.create({
    data: {
      externalOrderId: "1004",
      customerEmail: "alex@example.com",
      total: 100,
      status: "Shipped",
      storeId: store.id,
      createdAt: new Date("2026-03-05T09:45:00Z"),
    },
  });

  const order5 = await prisma.order.create({
    data: {
      externalOrderId: "1005",
      customerEmail: "maria@example.com",
      total: 80,
      status: "Cancelled",
      storeId: store.id,
      createdAt: new Date("2026-03-06T17:00:00Z"),
    },
  });

  await prisma.orderItem.createMany({
    data: [
      { orderId: order1.id, productId: products[0].id, quantity: 2, price: 30 },
      { orderId: order1.id, productId: products[2].id, quantity: 1, price: 20 },
      { orderId: order2.id, productId: products[1].id, quantity: 1, price: 50 },
      { orderId: order3.id, productId: products[0].id, quantity: 4, price: 30 },
      { orderId: order4.id, productId: products[3].id, quantity: 1, price: 100 },
      { orderId: order5.id, productId: products[1].id, quantity: 1, price: 50 },
      { orderId: order5.id, productId: products[2].id, quantity: 1, price: 20 },
      { orderId: order5.id, productId: products[0].id, quantity: 1, price: 30 },
    ],
  });

  console.log("Seed completed.");
  console.log("Demo user: mario@example.com / 123456");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });