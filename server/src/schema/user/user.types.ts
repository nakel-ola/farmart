import gql from "graphql-tag";

const userTypes = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    gender: String
    birthday: DateTime
    photoUrl: String
    phoneNumber: String
    level: Level
    blocked: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ForgetPassword {
    validationToken: String!
    msg: String
  }

  type ValidateCode {
    validate: Boolean!
  }

  type UsersData {
    page: Int!
    totalItems: Int!
    results: [User!]!
  }

  type EmployeeInvite {
    id: ID!
    level: String!
    email: String!
    status: String!
    inviteCode: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type TokenType {
    accessToken: String!
    refreshToken: String!
  }

  type RefreshToken {
    accessToken: String!
  }

  input RegisterInput {
    name: String!
    email: String!
    phoneNumber: String!
    password: String!
    inviteCode: String
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

  input ValidateCodeInput {
    name: String!
    email: String!
    validationToken: String!
  }

  input UpdatePasswordInput {
    oldPassword: String!
    newPassword: String!
  }

  input BlockUserInput {
    customerId: ID!
    blocked: Boolean!
    email: String!
  }

  input UsersInput {
    employee: Boolean = false
    page: Int!
    limit: Int
  }

  enum Level {
    Gold
    Silver
    Bronze
  }

  input UserInput {
    uid: ID
    name: String
    gender: String
    birthday: DateTime
    phoneNumber: String
    photoUrl: String
    level: Level
  }

  input CreateEmployeeInviteInput {
    email: String!
    level: Level!
  }



  extend type Query {
    user(uid: ID): User
    users(input: UsersInput!): UsersData!
    employeeInvites: [EmployeeInvite!]!
  }

  extend type Mutation {
    register(input: RegisterInput!): TokenType!
    login(input: LoginInput!): TokenType!
    forgetPassword(input: ForgetPasswordInput!): ForgetPassword!
    validateCode(input: ValidateCodeInput!): ValidateCode!
    changePassword(input: ChangePasswordInput!): TokenType!
    updatePassword(input: UpdatePasswordInput!): MsgType!
    updateUser(input: UserInput!): MsgType!
    blockUser(input: BlockUserInput!): MsgType!
    createEmployeeInvite(input: CreateEmployeeInviteInput!): MsgType!
    deleteEmployeeInvite(id: ID!): MsgType!
    deleteEmployee(id: ID!): MsgType!
    logout: MsgType!
    refresh: RefreshToken!
  }
`;
export default userTypes;
