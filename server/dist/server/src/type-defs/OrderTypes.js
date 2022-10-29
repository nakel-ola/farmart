"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const OrderTypes = (0, graphql_tag_1.gql) `
  type CreateOrderRespones {
    id: ID!
    orderId: ID!
    trackingId: ID!
    userId: ID!
  }

  type OrderProduct {
    id: ID!
    price: String!
    quantity: Int!
  }

  type Order {
    id: ID!
    userId: ID!
    orderId: ID!
    trackingId: ID!
    paymentId: ID!
    status: String!
    totalPrice: String!
    address: Address!
    paymentMethod: String!
    deliveryMethod: String!
    progress: [OrderProgress!]!
    createdAt: Date!
    updatedAt: Date!
    products: [OrderProduct!]!
  }

  type OrderData {
    page: Int!
    status: String
    totalItems: Int!
    results: [Order!]!
  }

  input OrderProductInput {
    id: ID!
    price: String!
    quantity: Int!
  }

  input OrderInput {
    totalPrice: String!
    address: AddressInput!
    paymentMethod: String!
    deliveryMethod: String!
    products: [OrderProductInput!]!
  }

  input OrdersInput {
    page: Int
    limit: Int
    customerId: ID
    status: String
  }

  type OrderProgress {
    name: String!
    checked: Boolean!
    createdAt: Date
    updatedAt: Date
  }

  input ProgressInput {
    id: ID!
    name: String!
  }

  input FilterByIdInput {
    page: Int
    limit: Int
    orderId: ID!
  }

  input FilterByStatusInput {
    page: Int
    limit: Int
    status: String!
  }

  extend type Query {
    orders(input: OrdersInput!): OrderData!
    order(id: ID!): Order!
    filterById(input: FilterByIdInput!): OrderData!
    filterByStatus(input: FilterByStatusInput!): OrderData!
  }
  extend type Mutation {
    createOrder(input: OrderInput!): CreateOrderRespones!
    updateProgress(input: ProgressInput!): Msg!
  }
`;
exports.default = OrderTypes;
