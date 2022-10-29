import type { Upload } from "graphql-upload-minimal";

export type ProductsArgs = {
  input: {
    outOfStock?: boolean;
    genre?: string;
    offset?: number;
    limit?: number;
  };
};

export type ProductImage = {
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
  image: ProductImage;
  price: number;
  stock: number;
  rating: number;
  currency: Currency;
  createdAt: Date;
  updatedAt: Date;
  reviews: ReviewType[];
};
export type ProductDataType = {
  genre: string;
  totalItems: number;
  results: ProductType[];
};

export type ProductSearchArgs = {
  input: {
    search: string;
    outOfStock?: boolean;
    offset?: number;
    limit?: number;
  };
};

export type ProductSearchType = {
  search: string;
  totalItems: number;
  results: ProductType[];
};

export type CreateReviewArgs = {
  input: {
    name: string;
    productId: string;
    photoUrl: string;
    message: string;
  };
};
export type DeleteReviewArgs = {
  input: {
    productId: string;
    reviewId: string;
  };
};

export type CurrencyInput = {
  name: string;
  symbol: string;
  symbolNative: string;
  decimalDigits: number;
  rounding: number;
  code: string;
  namePlural: string;
};

export type CreateProductArgs = {
  input: {
    title: string;
    slug: string;
    category: string;
    description: string;
    image: Upload;
    price: number;
    stock: number;
    currency: CurrencyInput;
  };
};

export type ProductImageInput = {
  name: string;
  url: string;
};

export type ModifyProductArgs = {
  input: {
    id: string;
    title: string;
    slug: string;
    category: string;
    description: string;
    image: ProductImageInput;
    imageUpload: Upload;
    price: number;
    stock: number;
    currency: CurrencyInput;
  };
};

export type ProductsSummaryType = {
  __typename: string;
  totalOrders: number;
  totalDelivered: number;
  totalStock: number;
  outOfStock: number;
};
