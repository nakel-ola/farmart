import { gql } from "graphql-tag";

const BannersTypes = gql`
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

  extend type Query {
    banners: [Banners!]!
  }

  extend type Mutation {
    createBanner(input: CreateBannerInput!): Msg!
    deleteBanner(id: ID!): Msg!
  }
`;
export default BannersTypes;
