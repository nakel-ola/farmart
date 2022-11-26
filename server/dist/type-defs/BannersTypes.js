"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const BannersTypes = (0, graphql_tag_1.gql) `
  type Banners {
    id: ID!
    link: String
    title: String!
    description: String!
    image: String!
  }

  input CreateBannerInput {
    image: Upload!
    title: String!
    description: String!
    link: String
  }

  input EditBannerInput {
    id: String!
    title: String!
    description: String!
    link: String
    image: Upload
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
exports.default = BannersTypes;
