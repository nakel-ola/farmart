export type OrderProduct = {
  productId: string;
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
  message: string;
  rating: number;
  title: string;
  userId: string;
};

export type ProductType = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: string;
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
  productsSummary: ProductSummaryType;
  ordersSummary: OrderSummaryType;
  ordersStatistics: OrderStatisticsType;
}

export type GraphQLOrdersResponse = {
  orders: OrdersData;
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
  image: File | null;
  price: string | undefined;
  discount: string | null;
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
  page: number;
  totalItems: number;
  results: UserType[];
};

export type GraphQLUserResponse = {
  users: UserData;
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

export type UploadResponse = {
  uploadFile: {
    url: string;
  };
};
