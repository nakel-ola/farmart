import { deny, shield } from "graphql-shield";
import merge from "lodash.merge";
import { addressMutation, addressQuery } from "./address";
import { bannerMutation, bannerQuery } from "./banners";
import { couponsMutation, couponsQuery } from "./coupons";
import { favoriteMutation, favoriteQuery } from "./favorite";
import { inboxesMutation, inboxesQuery } from "./inboxes";
import { ordersMutation, ordersQuery } from "./orders";
import { uploadMutation } from "./upload";
import { userMutation, userQuery } from "./user";
import { productsMutation, productsQuery } from "./products";

const permissions = shield(
  {
    Query: merge(
      { "*": deny },
      userQuery,
      bannerQuery,
      favoriteQuery,
      couponsQuery,
      inboxesQuery,
      ordersQuery,
      addressQuery,
      productsQuery
    ),
    Mutation: merge(
      { "*": deny },
      userMutation,
      uploadMutation,
      bannerMutation,
      favoriteMutation,
      couponsMutation,
      inboxesMutation,
      ordersMutation,
      addressMutation,
      productsMutation
    ),
  },
  { allowExternalErrors: true }
);

export default permissions;
