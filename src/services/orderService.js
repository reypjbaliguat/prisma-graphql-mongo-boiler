import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const orderService = {
  getOrderHistory: async (_, __, { userId }) => {
    if (!userId) throw new Error("Unauthorized");
    return prisma.order.findMany({ where: { userId } });
  },

  addToCart: async (_, { products, totalPrice }, { userId }) => {
    if (!userId) throw new Error("Unauthorized");
    return prisma.order.create({
      data: { userId, products, totalPrice },
    });
  },
};
