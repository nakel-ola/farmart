"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const EmployeeTypes = (0, graphql_tag_1.gql) `
  type Employee {
    id: ID!
    email: String!
    name: String!
    gender: String
    birthday: String
    phoneNumber: String
    photoUrl: String
    blocked: Boolean!
    createdAt: Date!
    updatedAt: Date!
    level: String!
  }
  input EmployeeRegisterInput {
    name: String!
    email: String!
    gender: String!
    phoneNumber: String!
    level: String!
    password: String!
  }

  input EmployeeUserInput {
    employeeId: ID
    email: String!
    name: String!
    level: String!
    phoneNumber: String!
    gender: String
    birthday: String
  }

  type EmployeeData {
    page: Int!
    totalItems: Int!
    results: [Employee!]!
  }

  extend type Query {
    employee(employeeId: ID): Employee!
    employees(input: UsersInput!): EmployeeData!
  }

  extend type Mutation {
    employeeRegister(input: EmployeeRegisterInput!): UserToken!
    employeeLogin(input: LoginInput!): UserToken!
    employeeForgetPassword(input: ForgetPasswordInput!): ForgetPassword!
    employeeChangePassword(input: ChangePasswordInput!): UserToken!
    employeeUpdatePassword(input: UpdatePasswordInput!): UserToken!
    employeeModifyUser(input: EmployeeUserInput!): Msg!
    updateEmployeePhotoUrl(image: Upload!): Msg!
  }
`;
exports.default = EmployeeTypes;
