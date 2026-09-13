import { db } from "@/lib/db";

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

  return {
    product,
    metrics: {
      revenue,
      unitsSold,
      orderCount,
      averageOrderValue,
    },
  };
}