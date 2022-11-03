"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const EmployeeTypes = (0, graphql_tag_1.gql) `
  type Employee {
    id: ID!
    email: String!
    name: String!
    gender: String
    birthday: Date
    phoneNumber: String
    photoUrl: String
    createdAt: Date!
    updatedAt: Date!
    level: String!
  }
  input EmployeeRegisterInput {
    name: String!
    email: String!
    phoneNumber: String!
    password: String!
    inviteCode: String!
  }

  input EmployeeUserInput {
    employeeId: ID
    email: String!
    name: String!
    level: String!
    phoneNumber: String!
    gender: String
    birthday: Date
  }

  type EmployeeData {
    page: Int!
    totalItems: Int!
    results: [Employee!]!
  }

  input CreateEmployeeInviteInput {
    email: String!
    level: String!
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

  union EmployeesUnion = EmployeeData | ErrorMsg
  union EmployeeUnion = Employee | ErrorMsg
  union EmployeeInvitesUnion = EmployeeInvite | ErrorMsg

  extend type Query {
    employee(employeeId: ID): EmployeeUnion!
    employees(input: UsersInput!): EmployeesUnion!
    employeeInvites: [EmployeeInvitesUnion!]!
  }

  extend type Mutation {
    employeeRegister(input: EmployeeRegisterInput!): Employee!
    employeeLogin(input: LoginInput!): Employee!
    employeeForgetPassword(input: ForgetPasswordInput!): ForgetPassword!
    employeeChangePassword(input: ChangePasswordInput!): Employee!
    employeeUpdatePassword(input: UpdatePasswordInput!): Employee!
    employeeModifyUser(input: EmployeeUserInput!): Msg!
    updateEmployeePhotoUrl(image: Upload!): Msg!
    createEmployeeInvite(input: CreateEmployeeInviteInput!): Msg!
    deleteEmployeeInvite(id: ID!): Msg!
    logout: Msg!
  }
`;
exports.default = EmployeeTypes;
