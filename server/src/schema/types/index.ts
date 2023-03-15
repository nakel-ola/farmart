import { mergeTypeDefs } from "@graphql-tools/merge";
import { gql } from "graphql-tag";
import addressTypes from "./address.types";
import bannersTypes from "./banners.types";
import couponTypes from "./coupon.types";
import customTypes from "./custom.types";
import favoritesTypes from "./favorites.types";
import inboxesTypes from "./inboxes.types";
import ordersTypes from "./orders.types";
import productsTypes from "./products.types";
import uploadTypes from "./upload.types";
import userType from "./user.types";

var rootTypes = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const types = [
  rootTypes,
  customTypes,
  userType,
  uploadTypes,
  productsTypes,
  bannersTypes,
  favoritesTypes,
  couponTypes,
  inboxesTypes,
  ordersTypes,
  addressTypes,
];
export default mergeTypeDefs(types);
