import type { AddressType, Product, ReviewType } from "../../typing";

export type ProductsQuerys = {
  products: {
    totalItems: number;
    results: Product[];
  };
};
export type SearchQuerys = {
  productSearch: {
    totalItems: number;
    search: string;
    results: Product[];
  };
};
export type ProductQueryType = {
  product: Product;
};

export type ReviewResponse = {
  reviews: ReviewType[];
};


export type FavoritesResponse = {
  favorites: {
    totalItems: number;
    results:  Product[]
  }
}

export type UploadResponse = {
  uploadFile: {
    url: string
  }
}

export type AddressesResponse = {
  addresses: AddressType[]
}