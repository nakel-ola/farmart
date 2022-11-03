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
export default BannersTypes;
