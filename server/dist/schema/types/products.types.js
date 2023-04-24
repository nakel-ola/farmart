"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const productsTypes = (0, graphql_tag_1.gql) `
  type Product {
    id: ID!
    title: String!
    slug: String!
    category: String!
    description: String!
    image: String!
    price: Float!
    stock: Int!
    rating: [Rating!]!
    favorite: Boolean!
    discount: String
    currency: Currency!
    createdAt: Date!
    updatedAt: Date!
    reviews: [Review]!
  }

  type Review {
    id: ID!
    name: String!
    userId: String!
    message: String!
    title: String!
    rating: Int!
  }

  type ProductImage {
    name: String!
    url: String!
  }

  type Currency {
    name: String!
    symbol: String!
    symbolNative: String
    decimalDigits: Int
    rounding: Int
    code: String!
    namePlural: String
  }

  type Rating {
    name: String!
    value: Int!
  }

  type Category {
    name: String!
  }

  type ProductData {
    genre: String
    totalItems: Int!
    results: [Product!]!
  }

  type ProductSearchData {
    search: String
    totalItems: Int!
    results: [Product!]!
  }

  type ProductSummary {
    totalOrders: Int!
    totalDelivered: Int!
    totalStock: Float!
    outOfStock: Int!
  }

  input ProductsInput {
    outOfStock: Boolean = false
    genre: String = null
    offset: Int = 0
    limit: Int = 20
  }

  input ProductSearchInput {
    search: String!
    outOfStock: Boolean = false
    category: [String] = null
    price: [Int] = null
    discount: [String] = null
    rating: Int
    offset: Int = 0
    limit: Int = 20
  }

  input ReviewInput {
    productId: String!
    name: String!
    title: String!
    rating: Int!
    message: String!
  }

  input DeleteReviewInput {
    productId: ID!
    reviewId: ID!
  }

  input CreateProductInput {
    title: String!
    slug: String!
    category: String!
    description: String!
    image: String!
    price: Float!
    stock: Int!
    discount: String
  }

  input ProductImageInput {
    name: String!
    url: String!
  }

  input UpdateProductInput {
    id: ID!
    title: String!
    slug: String!
    category: String!
    description: String!
    image: String!
    price: Float!
    stock: Int!
    currency: CurrencyInput
  }

  input CurrencyInput {
    name: String!
    symbol: String!
    symbolNative: String
    decimalDigits: Int
    rounding: Int
    code: String!
    namePlural: String
  }

  extend type Query {
    categories: [Category!]!
    products(input: ProductsInput = {}): ProductData!
    product(slug: String!): Product
    productsById(ids: [ID!]): [Product!]!
    productSearch(input: ProductSearchInput!): ProductSearchData!
    reviews(productId: ID!): [Review]!
    productsSummary: ProductSummary!
  }

  extend type Mutation {
    createProduct(input: CreateProductInput!): Msg!
    updateProduct(input: UpdateProductInput!): Msg!
    deleteProduct(id: ID!): Msg!
    createReview(input: ReviewInput!): Msg!
    deleteReview(input: DeleteReviewInput!): Msg!
    createCategories(categories: [String!]!): Msg!
    deleteCategories(categories: [String!]!): Msg!
  }
`;
exports.default = productsTypes;
//# sourceMappingURL=products.types.js.map