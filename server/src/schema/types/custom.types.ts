import { gql } from "graphql-tag";


const customTypes = gql`
  scalar DateTime

  scalar Date

  scalar Upload

  type Msg {
    message: String!
  }
`;
export default customTypes;
