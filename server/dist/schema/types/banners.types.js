"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const bannersTypes = (0, graphql_tag_1.default) `
  type Banners {
    id: ID!
    link: String
    title: String!
    description: String!
    image: String!
  }

  input CreateBannerInput {
    image: String!
    title: String!
    description: String!
    link: String
  }

  input EditBannerInput {
    id: String!
    title: String!
    description: String!
    link: String
    image: String
  }

  extend type Query {
    banners: [Banners!]!
  }

  extend type Mutation {
    createBanner(input: CreateBannerInput!): Msg!
    editBanner(input: EditBannerInput!): Msg!
    deleteBanner(id: ID!): Msg!
  }
`;
exports.default = bannersTypes;
//# sourceMappingURL=banners.types.js.map