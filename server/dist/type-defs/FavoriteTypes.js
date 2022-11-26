"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const FavoriteTypes = (0, graphql_tag_1.gql) `
  type Msg {
    msg: String!
  }

  input FavoriteInput {
    offset: Int 
    limit: Int
  }
  
  extend type Query {
    favorites(input: FavoriteInput): ProductData
    favorite(id: ID!): Product!
  }
  
  extend type Mutation {
    addToFavorites(id: ID!): Msg!
    removeFromFavorites(id: ID!): Msg!
    removeAllFromFavorites: Msg!
  }
`;
exports.default = FavoriteTypes;
