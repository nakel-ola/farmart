import { mergeTypeDefs } from "@graphql-tools/merge";
import { gql } from "graphql-tag";
import AddressTypes from "./AddressTypes";
import AuthTypes from "./AuthTypes";
import BannersTypes from "./BannersTypes";
import CouponTypes from "./CouponTypes";
import CustomTypes from "./CustomTypes";
import EmployeeTypes from "./EmployeeTypes";
import FavoriteTypes from "./FavoriteTypes";
import OrderTypes from "./OrderTypes";
import ProductTypes from "./ProductTypes";
import InboxTypes from "./InboxTypes";

var rootTypes = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const types = [
  AuthTypes,
  ProductTypes,
  FavoriteTypes,
  BannersTypes,
  OrderTypes,
  AddressTypes,
  rootTypes,
  CustomTypes,
  EmployeeTypes,
  CouponTypes,
  InboxTypes
];

export default mergeTypeDefs(types);
