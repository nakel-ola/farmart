import gql from "graphql-tag";

const CouponTypes = gql`
  type Coupon {
    id: String!
    email: String!
    discount: String!
    code: String!
    userId: String!
    description: String
    expiresIn: String
    createdAt: Date!
    updatedAt: Date!
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
    expiresIn: Date
  }

  extend type Query {
    verifyCoupon(input: VerifyCouponInput!): Coupon!
    coupons(customerId: ID): [Coupon!]!
  }

  extend type Mutation {
    createCoupon(input: CreateCouponInput!): Msg!
    deleteCoupon(id: ID!): Msg!
  }
`;
export default CouponTypes;
