"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const favoritesTypes = (0, graphql_tag_1.default) `
  type IdType {
    id: String!
  }

  input FavoriteInput {
    offset: Int
    limit: Int
  }

  extend type Query {
    favorites(input: FavoriteInput): ProductData
    favorite(id: ID!): Product
  }

  extend type Mutation {
    addToFavorites(id: ID!): Msg!
    removeFromFavorites(id: ID!): Msg!
    removeAllFromFavorites: Msg!
  }
`;
exports.default = favoritesTypes;
//# sourceMappingURL=favorites.types.js.map