import gql from "graphql-tag";

const couponTypes = gql`
  type Coupon {
    id: String!
    email: String!
    discount: String!
    code: String!
    userId: String!
    description: String
    expiresIn: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  input VerifyCouponInput {
    email: String!
    coupon: String!
  }

  input CreateCouponInput {
    discount: Int!
    email: String!
    description: String
    userId: String!
    expiresIn: DateTime
  }

  input DeleteCouponInput {
    id: ID!
    userId: ID!
  }

  extend type Query {
    verifyCoupon(input: VerifyCouponInput!): Coupon!
    coupons(customerId: ID): [Coupon!]!
  }

  extend type Mutation {
    createCoupon(input: CreateCouponInput!): MsgType!
    deleteCoupon(input: DeleteCouponInput!): MsgType!
  }
`;
export default couponTypes;
