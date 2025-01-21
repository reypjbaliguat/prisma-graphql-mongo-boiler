import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const jwtUtils = {
  sign: (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }),
  verify: (token) => jwt.verify(token, JWT_SECRET),
};
