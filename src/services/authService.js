import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export const authService = {
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
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }
    return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });
  },
};
