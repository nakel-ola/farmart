import { gql } from "graphql-tag";

const CustomTypes = gql`
  scalar Date
  scalar Upload

  type ErrorMsg {
    error: String!
  }
`;

export default CustomTypes;
