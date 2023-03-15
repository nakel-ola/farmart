import merge from "lodash.merge";
import address from "./address";
import banners from "./banners";
import coupons from "./coupons";
import favorites from "./favorites";
import inboxes from "./inboxes";
import orders from "./orders";
import products from "./products";
import upload from "./upload";
import user from "./user";

const Mutations = merge(
  user,
  upload,
  products,
  banners,
  favorites,
  coupons,
  inboxes,
  address,
  orders
);
export default Mutations;
