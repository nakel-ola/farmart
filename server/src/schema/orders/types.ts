import gql from "graphql-tag";

const ordersTypes = gql`
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
    createdAt: DateTime!
    updatedAt: DateTime!
    products: [OrderProduct!]!
  }

  type OrderProduct {
    id: ID!
    price: String!
    quantity: Int!
  }

  type OrderProgress {
    name: String!
    checked: Boolean!
    createdAt: DateTime
    updatedAt: DateTime
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
    createdAt: DateTime
    updatedAt: DateTime
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
    updateProgress(input: ProgressInput!): MsgType!
  }
`;
export default ordersTypes;
