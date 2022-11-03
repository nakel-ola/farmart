"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const ProductTypes = (0, graphql_tag_1.gql) `

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

  type Product {
    id: ID!
    title: String!
    slug: String!
    category: String!
    description: String!
    image: ProductImage!
    price: Float!
    stock: Int!
    rating: Int!
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
    photoUrl: String!
  }
  
  type Category {
    name: String!
  }
  
  input ProductsInput {
    outOfStock: Boolean
    genre: String
    offset: Int 
    limit: Int
  }

  type ProductData {
    genre: String
    totalItems: Int!
    results: [Product!]!
  }

  input ReviewInput {
    name: String!
    productId: String!
    photoUrl: String
    message: String!
  }

  input ProductImageInput {
    name: String!
    url: String!
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

  input CreateProductInput {
    title: String!
    slug: String!
    category: String!
    description: String!
    image: Upload!
    price: Float!
    stock: Int!
    currency: CurrencyInput!
  }

  input ModifyProductInput {
    id: ID!
    title: String!
    slug: String!
    category: String!
    description: String!
    image: ProductImageInput
    imageUpload: Upload
    price: Float!
    stock: Int!
    currency: CurrencyInput!
  }

  type ProductSummary {
    totalOrders: Int!
    totalDelivered: Int!
    totalStock: Float!
    outOfStock: Int!
  }

  input ProductSearchInput {
    search: String!
    outOfStock: Boolean
    category: [String]
    price: [Int]
    discount: [String]
    rating: Int
    offset: Int 
    limit: Int
  }

  type ProductSearchData {
    search: String
    totalItems: Int!
    results: [Product!]!
  }

  input DeleteReviewInput {
    productId: ID!
    reviewId: ID!
  }

  union ProductSummaryUnion = ProductSummary | ErrorMsg
  
  extend type Query {
    categories: [Category!]!
    products(input: ProductsInput): ProductData!
    product(slug: String!): Product!
    productById(id: ID!): Product!
    productSearch(input: ProductSearchInput!): ProductSearchData!
    reviews(productId: ID!): [Review]!
    productsSummary: ProductSummaryUnion!
  }

  extend type Mutation {
    createReview(input: ReviewInput!): Msg!
    deleteReview(input: DeleteReviewInput!): Msg!
    createProduct(input: CreateProductInput!): Msg!
    modifyProduct(input: ModifyProductInput!): Msg!
    deleteProduct(id: ID!): Msg!
    createCategories(categories: [String!]!): Msg!
    deleteCategories(categories: [String!]!): Msg!
  }
`;
exports.default = ProductTypes;
