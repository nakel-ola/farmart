import { mergeTypeDefs } from "@graphql-tools/merge";
import { DateTimeTypeDefinition } from "graphql-scalars";
import gql from "graphql-tag";
import address from "./address";
import banners from "./banners";
import coupon from "./coupon";
import products from "./products";
import user from "./user";
import favorites from "./favorites";
import inboxes from "./inboxes";
import orders from "./orders";
import upload from "./upload";

var rootTypes = gql`
  scalar Upload

  type MsgType {
    message: String!
  }
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const types: Parameters<typeof mergeTypeDefs>[0] = [
  rootTypes,
  user.types,
  products.types,
  banners.types,
  address.types,
  coupon.types,
  favorites.types,
  inboxes.types,
  orders.types,
  upload.types,
  DateTimeTypeDefinition,
];

export default mergeTypeDefs(types);
