import { deny, shield } from "graphql-shield";
import { merge } from "lodash";
import address from "./address";
import banners from "./banners";
import coupons from "./coupons";
import favorite from "./favorite";
import inboxes from "./inboxes";
import orders from "./orders";
import products from "./products";
import upload from "./upload";
import user from "./user";

const permissions = shield(
  {
    Query: merge(
      { "*": deny },
      address.queries,
      banners.queries,
      coupons.queries,
      favorite.queries,
      inboxes.queries,
      orders.queries,
      products.queries,
      user.queries
    ),
    Mutation: merge(
      { "*": deny },
      address.mutations,
      banners.mutations,
      coupons.mutations,
      favorite.mutations,
      inboxes.mutations,
      orders.mutations,
      products.mutations,
      upload.mutations,
      user.mutations
    ),
  },
  {
    allowExternalErrors: true,
  }
);

export default permissions;
