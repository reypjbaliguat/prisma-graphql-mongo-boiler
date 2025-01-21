import { createYoga } from "graphql-yoga";
import { createServer } from "http";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { makeExecutableSchema } from "@graphql-tools/schema";

dotenv.config();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// GraphQL Type Definitions
const typeDefs = `
  type User {
    id: ID!
    email: String!
    role: String!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
  }

  type Order {
    id: ID!
    products: [String!]!
    totalPrice: Float!
  }

  type Query {
    products: [Product!]!
    orderHistory: [Order!]!
  }

  type Mutation {
    signUp(email: String!, password: String!): String!
    login(email: String!, password: String!): String!
    addProduct(name: String!, price: Float!): Product!
    addToCart(products: [String!]!, totalPrice: Float!): Order!
  }
`;

// GraphQL Resolvers
const resolvers = {
  Query: {
    products: async () => prisma.product.findMany(),
    orderHistory: async (_, __, { userId }) => {
      if (!userId) throw new Error("Unauthorized");
      return prisma.order.findMany({ where: { userId } });
    },
  },
  Mutation: {
    signUp: async (_, { email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, role: "USER" },
      });
      return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: "7d",
      });
    },
    login: async (_, { email, password }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password)))
        throw new Error("Invalid credentials");
      return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: "7d",
      });
    },
    addProduct: async (_, { name, price }, { role }) => {
      if (role !== "ADMIN") throw new Error("Forbidden");
      return prisma.product.create({ data: { name, price } });
    },
    addToCart: async (_, { products, totalPrice }, { userId }) => {
      if (!userId) throw new Error("Unauthorized");
      return prisma.order.create({
        data: { userId, products, totalPrice },
      });
    },
  },
};

// Combine type definitions and resolvers into a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Middleware to extract user from token
const context = async ({ request }) => {
  const token = request.headers.authorization || "";
  try {
    const { userId, role } = jwt.verify(token, JWT_SECRET);
    return { userId, role };
  } catch {
    return {};
  }
};

// Create Yoga server
const yoga = createYoga({ schema, context });

// Create an HTTP server
const server = createServer(yoga);

// Start the server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
