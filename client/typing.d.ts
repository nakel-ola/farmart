export type Image = {
  name: string;
  url: string;
};

export type Currency = {
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
  id: string;
  name: string;
  message: string;
  rating: number;
  title: string;
  userId: string;
};
export type Product = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: Image;
  price: number;
  currency: Currency;
  stock: number;
  rating: Array<RatingType>;
  review: Array<ReviewType>
};

export interface Basket extends Product {
  quantity: number;
}

export type UserType = {
  birthday: Date;
  email: string;
  gender: string;
  id: string;
  name: string;
  phoneNumber: string;
  photoUrl: string;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderProduct = {
  id: string;
  quantity: number;
  price: string;
};

export type OrderProgress = {
  name: string;
  checked: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderType = {
  id: string;
  __typename: string;
  userId: string;
  orderId: string;
  trackingId: string;
  paymentId: string;
  status: string;
  totalPrice: number;
  paymentMethod: string;
  deliveryMethod: string;
  createdAt: Date;
  updatedAt: Date;
  shippingFee: String;
  pickup: String;
  coupon: Coupon;
  phoneNumber: string;
  products: Array<OrderProduct>;
  address: AddressType;
  progress: Array<OrderProgress>;
};

export type AddressType = {
  name: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  country: string;
  default?: boolean;
  info?: string;
  phoneNumber2?: string;
};
export type InboxType = {
  id: string;
  title: string;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InboxData = {
  page: number;
  totalItems: number;
  results: Array<InboxType>;
};

export type Coupon = {
  id: string;
  email: string;
  code: string;
  discount: number;
  userId: string;
  description?: string;
  expiresIn: Date;
};

export type GraphQLOrdersResponse = {
  orders: OrdersData | ErrorMsg;
};

export type OrdersData = {
  __typename: string;
  page: number;
  status?: string;
  totalItems: number;
  results: Array<OrderType>;
};

export type ErrorMsg = {
  __typename: string;
  error: string;
};

export type BannerType = {
  id: string;
  image: string;
  title: string;
  description: string;
  link: string;
};

export type ValidateCodeType = {
  name: string;
  email: string;
  validationToken: string;
};
