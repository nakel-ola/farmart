import { gql } from "graphql-tag";

const addressTypes = gql`
  type Address {
    id: ID!
    name: String!
    street: String!
    city: String!
    state: String!
    country: String!
    userId: String!
    info: String
    default: Boolean
    phoneNumber: String!
    phoneNumber2: String
  }

  input AddressInput {
    name: String!
    street: String!
    city: String!
    state: String!
    country: String!
    info: String
    phoneNumber: String!
    phoneNumber2: String
  }

  input UpdateAddressInput {
    id: ID!
    name: String!
    street: String!
    city: String!
    userId: String!
    state: String!
    country: String!
    info: String
    phoneNumber: String!
    phoneNumber2: String
    default: Boolean
  }

  extend type Query {
    addresses: [Address!]!
    address(id: ID!): Address!
  }

  extend type Mutation {
    createAddress(input: AddressInput!): Msg!
    updateAddress(input: UpdateAddressInput!): Msg!
    deleteAddress(id: ID!): Msg!
  }
`;
export default addressTypes;
