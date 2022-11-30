import { gql } from "graphql-tag";

const OrderTypes = gql`
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

  input CouponInput {
    id: String!
    email: String!
    discount: String!
    coupon: String!
    userId: String!
    description: String
    expiresIn: String
    createdAt: Date
    updatedAt: Date
  }

  input OrderInput {
    totalPrice: String!
    address: AddressInput
    pickup: String
    coupon: CouponInput
    paymentMethod: String!
    shippingFee: String
    phoneNumber: String
    deliveryMethod: String!
    products: [OrderProductInput!]!
    paymentId: String!
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

  type OrderSummary {
    pending: Int!
    delivered: Int!
    canceled: Int!
  }

  type OrderStatistics {
    min: Int!
    max: Int!
    week: [Int!]!
    month: [Int!]!
  }

  union OrdersUnion = OrderData | ErrorMsg
  union OrderUnion = Order | ErrorMsg
  union FilterByIdUnion = OrderData | ErrorMsg
  union FilterByStatusUnion = OrderData | ErrorMsg
  union OrdersSummaryUnion = OrderSummary | ErrorMsg
  union OrdersStatisticsUnion = OrderStatistics | ErrorMsg

  extend type Query {
    orders(input: OrdersInput!): OrdersUnion
    order(id: ID!): OrderUnion
    filterById(input: FilterByIdInput!): FilterByIdUnion
    filterByStatus(input: FilterByStatusInput!): FilterByStatusUnion
    ordersSummary: OrdersSummaryUnion!
    ordersStatistics: OrdersStatisticsUnion!
  }
  extend type Mutation {
    createOrder(input: OrderInput!): CreateOrderRespones!
    updateProgress(input: ProgressInput!): Msg!
  }
`;
export default OrderTypes;
