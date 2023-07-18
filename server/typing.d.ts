import type DataLoader from "dataloader";
import type { Request, Response } from "express";
import type { Redis } from "ioredis";
import { db } from "./src/db/entities";
import { Gender } from "./src/db/entities/user.entity";

export type Loaders = {
  userLoader: DataLoader<unknown, UserType, unknown>;
  addressLoader: DataLoader<unknown, AddressType, unknown>;
  productLoader: DataLoader<unknown, ProductType, unknown>;
};

export type Context = Loaders & {
  res: Response;
  req: Request;
  db: dbType;
  redis: Redis;
  user: Omit<UserType, "password"> | null;
  isAdmin: boolean;
};

export type dbType = typeof db;

export type ResolverFn<Args = any, Results = any> = (
  _: any,
  args: Args,
  ctx: Context,
  info: any
) => Promise<Results>;

export type MsgType = {
  message: string;
};

export type AddressType = {
  id: string;
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
  id: string;
  email: string;
  name: string;
  photoUrl: string | null;
  password: string;
  gender: Gender | null;
  birthday: string | null;
  phoneNumber: string | null;
  blocked: boolean;
  level: Level;
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
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      JWT_SECRET: string;
      EXPIRES_IN: string;
      REFRESH_EXPIRES_IN: string;
      STMP_PASSWORD: string;
      STMP_EMAIL: string;
      ALLOWED_ORIGINS: string;
      REDIS_URL: string;
      REDIS_PORT: string;
      REDIS_USERNAME: string;
      REDIS_PASSWORD: string;
      REDIS_HOST: string;
      STORAGE_BUCKET_NAME: string;
      STORAGE_PROJECT_ID: string;
    }
  }
}
