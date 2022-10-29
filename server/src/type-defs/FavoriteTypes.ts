import { gql } from "graphql-tag";


const FavoriteTypes = gql`
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

export default FavoriteTypes;