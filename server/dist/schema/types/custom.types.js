"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const customTypes = (0, graphql_tag_1.gql) `
  scalar DateTime

  scalar Date

  scalar Upload

  type Msg {
    message: String!
  }
`;
exports.default = customTypes;
//# sourceMappingURL=custom.types.js.map