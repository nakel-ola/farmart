import type { AddressArgs } from "./address";
import type { CouponType } from "./coupon";



export type CreateOrderArgs = {
  input: {
    totalPrice: string;
    address: AddressArgs;
    paymentMethod: string;
    deliveryMethod: string;
    shippingFee: string;
    pickup: string;
    coupon: CouponType;
    phoneNumber: string;
    products: OrderProductInput[];
    paymentId: string;
  };
};

export type OrderProductInput = {
  id: string;
  price: string;
  quantity: number;
};

export type CreateOrderType = {
  id: string;
  orderId: string;
  trackingId: string;
  userId: string;
};
export type OrdersArgs = {
  input: {
    page: number;
    limit: number;
    customerId: string;
    status: string;
  };
};

export type OrderDataType = {
  __typename: string;
  page: number;
  status: string;
  totalItems: number;
  results: OrderType[];
};

export type OrderType = {
  __typename?: string;
  userId: string;
  orderId: string;
  trackingId: string;
  paymentId: string;
  status: string;
  totalPrice: string;
  address: AddressArgs;
  paymentMethod: string;
  deliveryMethod: string;
  progress: OrderProgress[];
  products: OrderProductInput[];
};

export type OrderProgress = {
  name: string;
  checked: boolean;
};

export type OrderArgs = {
  id: string;
};

export type UpdateProgressArgs = {
  input: {
    id: string;
    name: string;
  };
};

export type FilterByIdArgs = {
  input: {
    page?: number;
    limit?: number;
    orderId: string;
  };
};

export type FilterByStatusArgs = {
  input: {
    page?: number;
    limit?: number;
    status: string;
  };
};
