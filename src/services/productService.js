import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const productService = {
  getAllProducts: async () => {
    return prisma.product.findMany();
  },

  addProduct: async (_, { name, price }, { role }) => {
    if (role !== "ADMIN") throw new Error("Forbidden");
    return prisma.product.create({ data: { name, price } });
  },
};
