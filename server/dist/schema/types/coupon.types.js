"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const couponTypes = (0, graphql_tag_1.default) `
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

  input DeleteCouponInput {
    id: ID!
    userId: ID!
  }

  extend type Query {
    verifyCoupon(input: VerifyCouponInput!): Coupon!
    coupons(customerId: ID): [Coupon!]!
  }

  extend type Mutation {
    createCoupon(input: CreateCouponInput!): Msg!
    deleteCoupon(input: DeleteCouponInput!): Msg!
  }
`;
exports.default = couponTypes;
//# sourceMappingURL=coupon.types.js.map