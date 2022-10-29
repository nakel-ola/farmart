import { gql } from "graphql-tag";


const AuthTypes = gql`
  type UserToken {
    token: String!
  }
  
  type ForgetPassword {
    validationToken: String!
    msg: String
  }

  type User {
    id: ID!
    email: String!
    name: String!
    gender: String
    birthday: Date
    photoUrl: String
    phoneNumber: String
    blocked: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  input UserInput {
    email: String!
    name: String!
    gender: String
    birthday: Date
    phoneNumber: String
  }
  
  input RegisterInput {
    name: String!
    email: String!
    phoneNumber: String!
    password: String!
  }
  
  input LoginInput {
    email: String!
    password: String!
  }
  
  input ForgetPasswordInput {
    name: String!
    email: String!
  }
  
  input ChangePasswordInput {
    name: String!
    email: String!
    password: String!
    validationToken: String!
  }

  input UpdatePasswordInput {
    oldPassword: String!
    newPassword: String!
    email: String!
  }

  input UsersInput {
    admin: Boolean!
    page: Int!
    limit: Int
  }

  type UsersData {
    page: Int!
    totalItems: Int!
    results: [User!]!
  }

  input BlockUserInput {
    customerId: ID!
    blocked: Boolean!
    email: String!
  }

  union UsersUnion = UsersData | ErrorMsg
  union UserUnion = User | ErrorMsg

  extend type Query {
    user(customerId: ID): UserUnion!
    users(input: UsersInput!): UsersUnion!
  }
  
  extend type Mutation {
    register(input: RegisterInput!): User!
    login(input: LoginInput!): User!
    forgetPassword(input: ForgetPasswordInput!): ForgetPassword!
    changePassword(input: ChangePasswordInput!): User!
    updatePassword(input: UpdatePasswordInput!): User!
    modifyUser(input: UserInput!): Msg!
    blockUser(input: BlockUserInput!): Msg!
    updatePhotoUrl(image: Upload!): Msg!
  }
`;

export default AuthTypes;
