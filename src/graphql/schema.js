import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "./resolvers.js";

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

export const schema = makeExecutableSchema({ typeDefs, resolvers });
