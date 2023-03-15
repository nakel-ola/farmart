import type DataLoader from "dataloader";
import type { Request, Response } from "express";
import type { Redis } from "ioredis";
import type { HydratedDocument, Model } from "mongoose";

export type Context = {
  res: Response;
  req: Request & { admin?: boolean };
  db: DBType;
  redis: Redis;
  user: User | null;
  userLoader: DataLoader<unknown, User, unknown>;
  addressLoader: DataLoader<unknown, Address, unknown>;
  productLoader: DataLoader<unknown, Product, unknown>;
};

export type ResolverFn<Args = any, Results = any> = (
  _: any,
  args: Args,
  ctx: Context,
  info: any
) => Results;

export type MsgType = {
  message: string;
};

export type AddressType = {
  userId: string;
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  info?: string;
  phoneNumber: string;
  phoneNumber2?: string;
  default?: boolean;
};

export type Level = "Gold" | "Silver" | "Bronze" | null;

export type UserType = {
  email: string;
  name: string;
  photoUrl?: string;
  password: string;
  gender?: string;
  birthday?: string;
  phoneNumber: string;
  blocked: boolean;
  level: Level;
};

export type User = HydratedDocument<Omit<UserType, "password">>;
export type Address = HydratedDocument<AddressType>;
export type Product = HydratedDocument<ProductType>;

export type ValidateType = {
  name: string;
  email: string;
  validationToken: string;
  expiresIn: Date;
};

export type CurrencyType = {
  name: string;
  symbol: string;
  symbolNative: string;
  decimalDigits: number;
  rounding: number;
  code: string;
  namePlural: string;
};

export type RatingType = {
  name: string;
  value: number;
};

export type ReviewType = {
  productId: string;
  name: string;
  title: string;
  message: string;
  rating: number;
  userId: string;
};

export type ProductType = {
  title: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  discount: string;
  image: string;
  currency: CurrencyType;
  rating: RatingType[];
};

export type BannerType = {
  title: string;
  description: string;
  image: string;
  link?: string;
};

export type FavoriteType = {
  userId: string;
  data: string[];
};

export type OrderProgressType = {
  name: string;
  checked: boolean;
};

export type OrderType = {
  userId: string;
  totalPrice: string;
  orderId: string;
  status: string;
  paymentMethod: string;
  deliveryMethod: string;
  address?: AddressType;
  pickup?: string;
  products: OrderProductType[];
  trackingId: string;
  paymentId: string;
  progress: OrderProgressType[];
  shippingFee?: string;
  coupon?: CouponType & { id: string };
  phoneNumber?: string;
};

export type OrderProductType = {
  productId: string;
  price: string;
  quantity: number;
};

export type CouponType = {
  email: string;
  code: string;
  discount: number;
  description?: string;
  userId: string;
  expiresIn: Date;
};

export type CategoryType = {
  name: string;
};

export type InboxType = {
  title: string;
  description: string;
  userId: string;
};

export type InviteType = {
  email: string;
  level: Level;
  status: string;
  inviteCode: string;
};

export type DBType = {
  users: Model<UserType>;
  validate: Model<ValidateType>;
  products: Model<ProductType>;
  banners: Model<BannerType>;
  favorites: Model<FavoriteType>;
  orders: Model<OrderType>;
  coupons: Model<CouponType>;
  categories: Model<CategoryType>;
  inboxes: Model<InboxType>;
  invites: Model<InviteType>;
  addresses: Model<AddressType>;
  reviews: Model<ReviewType>;
};
