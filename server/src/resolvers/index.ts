import merge from "lodash.merge";
import AddressResolver from "./AddressResolver";
import AuthResolver from "./AuthResolver";
import BannersResolver from "./BannersResolver";
import CouponResolver from "./CouponResolver";
import CustomResolver from "./CustomResolver";
import EmployeeResolver from "./EmployeeResolver";
import FavoriteResolver from "./FavoriteResolver";
import OrderResolver from "./OrderResolver";
import ProductResolver from "./ProductResolver";
import InboxResolver from "./InboxResolver";

const resolvers = {};
export default merge(
  resolvers,
  ProductResolver,
  AuthResolver,
  FavoriteResolver,
  AddressResolver,
  OrderResolver,
  BannersResolver,
  CustomResolver,
  EmployeeResolver,
  CouponResolver,
  InboxResolver,
);
