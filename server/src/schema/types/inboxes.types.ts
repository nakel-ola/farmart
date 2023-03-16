import { gql } from "graphql-tag";

const inboxesTypes = gql`
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

export default inboxesTypes;