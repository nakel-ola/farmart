"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const AddressTypes = (0, graphql_tag_1.gql) `
  type Address {
    id: ID!
    name: String!
    street: String!
    city: String!
    state: String!
    country: String!
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

  input ModifyAddressInput {
    id: ID!
    name: String!
    street: String!
    city: String!
    state: String!
    country: String!
    info: String
    phoneNumber: String!
    phoneNumber2: String
  }

  extend type Query {
    addresses: [Address!]!
    address(id: ID!): Address!
  }

  extend type Mutation {
    createAddress(input: AddressInput!): Msg!
    modifyAddress(input: ModifyAddressInput!): Msg!
    deleteAddress(id: ID!): Msg!
  }
`;
exports.default = AddressTypes;
