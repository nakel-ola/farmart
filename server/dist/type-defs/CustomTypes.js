"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const CustomTypes = (0, graphql_tag_1.gql) `
  scalar Date
  scalar Upload

  type ErrorMsg {
    error: String!
  }
`;
exports.default = CustomTypes;
