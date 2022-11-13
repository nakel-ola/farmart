import { gql } from "graphql-tag";

const CustomTypes = gql`
  scalar Date
  scalar Upload

  type ErrorMsg {
    error: String!
  }

  input UploadFileInput {
    dataUrl: String!
    fileName: String!
    mimeType: String!
  }

  type UploadFile {
    url: String!
    name: String!
  }

  extend type Mutation {
    uploadFile(input: UploadFileInput!): UploadFile
  }
`;

export default CustomTypes;
