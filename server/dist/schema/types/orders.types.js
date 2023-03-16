"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const ordersTypes = (0, graphql_tag_1.default) `
  type Order {
    id: ID!
    userId: ID!
    orderId: ID!
    trackingId: ID!
    paymentId: ID!
    status: String!
    totalPrice: String!
    address: Address
    pickup: String
    shippingFee: String
    coupon: Coupon
    phoneNumber: String
    paymentMethod: String!
    deliveryMethod: String!
    progress: [OrderProgress!]!
    createdAt: Date!
    updatedAt: Date!
    products: [OrderProduct!]!
  }

  type OrderProduct {
    productId: ID!
    price: String!
    quantity: Int!
  }

  type OrderProgress {
    name: String!
    checked: Boolean!
    createdAt: Date
    updatedAt: Date
  }

  type OrderData {
    page: Int!
    status: String
    totalItems: Int!
    results: [Order!]!
  }

  type OrderSummary {
    pending: Int!
    delivered: Int!
    canceled: Int!
  }

  type OrdersStatistics {
    min: Int!
    max: Int!
    week: [Int!]!
    month: [Int!]!
  }

  type CreateOrderRespones {
    id: ID!
    orderId: ID!
    trackingId: ID!
    userId: ID!
  }

  input OrdersInput {
    page: Int
    limit: Int
    customerId: ID
    status: String
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

  input OrderProductInput {
    id: ID!
    price: String!
    quantity: Int!
  }

  input CouponInput {
    id: String!
    email: String!
    discount: String!
    code: String!
    userId: String!
    description: String
    expiresIn: String
    createdAt: Date
    updatedAt: Date
  }

  input OrderAddressInput {
    id: String!
    name: String!
    street: String!
    city: String!
    state: String!
    country: String!
    info: String
    phoneNumber: String!
    phoneNumber2: String
    userId: String!
    default: Boolean!
  }

  input OrderInput {
    totalPrice: String!
    address: OrderAddressInput
    pickup: String
    coupon: CouponInput
    paymentMethod: String!
    shippingFee: String
    phoneNumber: String
    deliveryMethod: String!
    products: [OrderProductInput!]!
    paymentId: String!
  }

  input ProgressInput {
    id: ID!
    name: String!
  }

  extend type Query {
    orders(input: OrdersInput!): OrderData
    order(id: ID!): Order
    filterById(input: FilterByIdInput!): OrderData
    filterByStatus(input: FilterByStatusInput!): OrderData
    ordersSummary: OrderSummary!
    ordersStatistics: OrdersStatistics!
  }
  extend type Mutation {
    createOrder(input: OrderInput!): CreateOrderRespones!
    updateProgress(input: ProgressInput!): Msg!
  }
`;
exports.default = ordersTypes;
