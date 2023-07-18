import dbDataSource from "..";
import Address from "./address.entity";
import Banner from "./banner.entity";
import Category from "./category.entity";
import Coupon from "./coupon.entity";
import Favorite from "./favorite.entity";
import Inbox from "./inbox.entity";
import Invite from "./invite.entity";
import Order from "./order.entity";
import Product from "./product.entity";
import Review from "./review.entity";
import User from "./user.entity";

export const db = {
  addresses: dbDataSource.getMongoRepository(Address),
  banners: dbDataSource.getMongoRepository(Banner),
  categories: dbDataSource.getMongoRepository(Category),
  coupons: dbDataSource.getMongoRepository(Coupon),
  favorites: dbDataSource.getMongoRepository(Favorite),
  inboxes: dbDataSource.getMongoRepository(Inbox),
  invites: dbDataSource.getMongoRepository(Invite),
  orders: dbDataSource.getMongoRepository(Order),
  products: dbDataSource.getMongoRepository(Product),
  reviews: dbDataSource.getMongoRepository(Review),
  users: dbDataSource.getMongoRepository(User),
};
