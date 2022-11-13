"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const CustomTypes = (0, graphql_tag_1.gql) `
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
exports.default = CustomTypes;
