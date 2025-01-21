import { authService } from "../services/authService.js";
import { productService } from "../services/productService.js";
import { orderService } from "../services/orderService.js";

export const resolvers = {
  Query: {
    products: productService.getAllProducts,
    orderHistory: orderService.getOrderHistory,
  },
  Mutation: {
    signUp: authService.signUp,
    login: authService.login,
    addProduct: productService.addProduct,
    addToCart: orderService.addToCart,
  },
};
