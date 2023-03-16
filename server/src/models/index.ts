import type { DBType } from "../../typing";
import banners from "./bannerSchema";
import categories from "./categorySchema";
import coupons from "./couponSchema";
import favorites from "./favoriteSchema";
import inboxes from "./inboxSchema";
import invites from "./inviteSchema";
import orders from "./orderSchema";
import products from "./productSchema";
import users from "./userSchema";
import addresses from "./addressSchema";
import reviews from "./reviewSchema";

const db: DBType = {
  users,
  products,
  banners,
  favorites,
  orders,
  coupons,
  categories,
  inboxes,
  invites,
  addresses,
  reviews
};

export default db;
