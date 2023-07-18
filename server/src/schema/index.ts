import { DateTimeResolver } from "graphql-scalars";
import { merge } from "lodash";
import address from "./address";
import banners from "./banners";
import coupon from "./coupon";
import favorites from "./favorites";
import inboxes from "./inboxes";
import orders from "./orders";
import products from "./products";
import typeDefs from "./types";
import upload from "./upload";
import user from "./user";

const Mutation = merge(
  address.mutations,
  banners.mutations,
  coupon.mutations,
  favorites.mutations,
  inboxes.mutations,
  products.mutations,
  orders.mutations,
  upload.mutations,
  user.mutations
);
const Query = merge(
  address.queries,
  banners.queries,
  coupon.queries,
  favorites.queries,
  inboxes.queries,
  products.queries,
  orders.queries,
  upload.queries,
  user.queries
);

const resolvers = {
  Query,
  Mutation,
  Upload: require("graphql-upload-minimal").GraphQLUpload,
  DateTime: DateTimeResolver,
};
export { resolvers, typeDefs };
