import gql from "graphql-tag";

const bannersTypes = gql`
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
    createBanner(input: CreateBannerInput!): MsgType!
    editBanner(input: EditBannerInput!): MsgType!
    deleteBanner(id: ID!): MsgType!
  }
`;
export default bannersTypes;
