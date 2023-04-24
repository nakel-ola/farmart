"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const userType = (0, graphql_tag_1.default) `
  type User {
    id: ID!
    email: String!
    name: String!
    gender: String
    birthday: Date
    photoUrl: String
    phoneNumber: String
    level: Level
    blocked: Boolean!
    createdAt: Date!
    updatedAt: Date!
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
    createdAt: Date!
    updatedAt: Date!
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
    birthday: Date
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
    register(input: RegisterInput!): Msg!
    login(input: LoginInput!): Msg!
    forgetPassword(input: ForgetPasswordInput!): ForgetPassword!
    validateCode(input: ValidateCodeInput!): ValidateCode!
    changePassword(input: ChangePasswordInput!): User!
    updatePassword(input: UpdatePasswordInput!): User!
    updateUser(input: UserInput!): Msg!
    blockUser(input: BlockUserInput!): Msg!
    createEmployeeInvite(input: CreateEmployeeInviteInput!): Msg!
    deleteEmployeeInvite(id: ID!): Msg!
    deleteEmployee(id: ID!): Msg!
    logout: Msg!
  }
`;
exports.default = userType;
//# sourceMappingURL=user.types.js.map