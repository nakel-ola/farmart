"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const BannersTypes = (0, graphql_tag_1.gql) `
  type Banners {
    id: ID!
    link: String
    image: String!
  }

  input CreateBannerInput {
    image: Upload!
    link: String
  }

  extend type Query {
    banners: [Banners!]!
  }

  extend type Mutation {
    createBanner(input: CreateBannerInput!): Msg!
    deleteBanner(id: ID!): Msg!
  }
`;
exports.default = BannersTypes;
