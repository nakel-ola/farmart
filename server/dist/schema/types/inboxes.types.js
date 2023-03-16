"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const inboxesTypes = (0, graphql_tag_1.gql) `
  type Inbox {
    id: ID!
    title: String!
    description: String!
    userId: ID!
    createdAt: Date!
    updatedAt: Date!
  }
  type InboxData {
    page: Int!
    totalItems: Int!
    results: [Inbox]
  }

  input InboxInput {
    page: Int
    limit: Int
    customerId: ID
  }

  input CreateInboxInput {
    title: String!
    description: String!
    userId: String!
  }

  input UpdateIndoxInput {
    title: String!
    description: String!
    userId: String!
    id: ID!
  }

  extend type Query {
    inboxes(input: InboxInput!): InboxData
  }
  extend type Mutation {
    createInbox(input: CreateInboxInput!): Msg!
    updateInbox(input: UpdateIndoxInput!): Msg!
  }
`;
exports.default = inboxesTypes;
