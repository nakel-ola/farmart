import { gql } from "graphql-tag";

const inboxesTypes = gql`
  type Inbox {
    id: ID!
    title: String!
    description: String!
    userId: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
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

  input DeleteIndoxInput {
    userId: String!
    id: String!
  }

  extend type Query {
    inboxes(input: InboxInput!): InboxData
  }
  extend type Mutation {
    createInbox(input: CreateInboxInput!): MsgType!
    updateInbox(input: UpdateIndoxInput!): MsgType!
    deleteInbox(input: DeleteIndoxInput!): MsgType!
  }
`;

export default inboxesTypes;
