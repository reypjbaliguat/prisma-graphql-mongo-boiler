import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const context = async ({ request }) => {
  const token = request.headers.authorization || "";
  try {
    const { userId, role } = jwt.verify(token, JWT_SECRET);
    return { userId, role };
  } catch {
    return {};
  }
};
