export type OrderProduct = {
  id: string;
  quantity: number;
  price: string;
};

export type AddressType = {
  street: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
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
  shippingFee: String;
  pickup: String;
  coupon: Coupon;
  phoneNumber: string;
  paymentMethod: string;
  deliveryMethod: string;
  createdAt: Date;
  updatedAt: Date;
  products: OrderProduct[];
  address: AddressType;
  progress: OrderProgress[];
};

export type ReviewType = {
  id: string;
  name: string;
  userId: string;
  message: string;
  photoUrl: string;
};

export type ProductType = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: Image;
  currency: Currency;
  price: number;
  stock: number;
  rating: number;
  updatedAt: Date;
  createdAt: Date;
  quantity: number | null;
  reviews: ReviewType[];
};

export type OrdersData = {
  __typename: string;
  page: number;
  status?: string;
  totalItems: number;
  results: OrderType[];
};

export type ErrorMsg = {
  __typename: string;
  error: string;
};

export interface GraphQLDashboardResponse extends GraphQLOrdersResponse {
  productsSummary: ProductSummaryType | ErrorMsg;
  ordersSummary: OrderSummaryType | ErrorMsg;
  ordersStatistics: OrderStatisticsType | ErrorMsg;
}

export type GraphQLOrdersResponse = {
  orders: OrdersData | ErrorMsg;
};

export type GraphQLProductResponse = {
  products: {
    genre: string;
    totalItems: number;
    results: ProductType[];
  };
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

export type Image = {
  name: string;
  url: string;
};

export interface CreateProductForm {
  title: string;
  category: string;
  description: string;
  image: any | null;
  price: number | undefined;
  currency: Currency | null;
  stock: number | undefined;
}

export type ProductSummaryType = {
  __typename: string;
  totalOrders: number;
  totalDelivered: number;
  totalStock: number;
  outOfStock: number;
};
export type OrderSummaryType = {
  __typename: string;
  pending: number;
  delivered: number;
  canceled: number;
};
export type OrderStatisticsType = {
  __typename: string;
  min: number;
  max: number;
  week: number[];
  month: number[];
};


export type UserType = {
  birthday: Date;
  email: string;
  gender: string;
  id: string;
  name: string;
  phoneNumber: string;
  photoUrl: string;
  level: Level;
  createdAt: Date;
  updatedAt: Date;
};
export type EmployeeType = {
  birthday: Date;
  email: string;
  gender: string;
  id: string;
  name: string;
  phoneNumber: string;
  photoUrl: string;
  level: Level;
  createdAt: Date;
  updatedAt: Date;
};

export type UserData = {
  __typename: string;
  page: number;
  totalItems: number;
  results: UserType[];
};

export type GraphQLUserResponse = {
  users: UserData | ErrorMsg;
};
export type GraphQLEmployeesResponse = {
  employees: {
    page: number;
    totalItems: number;
    results: UserType[];
  };
};

export type BannerType = {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
};

export type CategoryType = {};

export type Coupon = {
  id: string;
  email: string;
  code: string;
  discount: number;
  userId: string;
  description?: string;
  expiresIn: Date;
};

export type Discount = {
  name: string;
  value: number;
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
  results: InboxType[];
};

export type Level = "Gold" | "Silver" | "Bronze";

export type InviteType = {
  id: string;
  email: string;
  level: Level;
  status: "pending" | "accepted";
  createdAt: Date;
};
