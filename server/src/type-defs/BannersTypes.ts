import { gql } from "graphql-tag";

const BannersTypes = gql`
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
export default BannersTypes;
