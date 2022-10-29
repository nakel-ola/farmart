"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const merge_1 = require("@graphql-tools/merge");
const graphql_tag_1 = require("graphql-tag");
const AddressTypes_1 = __importDefault(require("./AddressTypes"));
const AuthTypes_1 = __importDefault(require("./AuthTypes"));
const BannersTypes_1 = __importDefault(require("./BannersTypes"));
const CouponTypes_1 = __importDefault(require("./CouponTypes"));
const CustomTypes_1 = __importDefault(require("./CustomTypes"));
const EmployeeTypes_1 = __importDefault(require("./EmployeeTypes"));
const FavoriteTypes_1 = __importDefault(require("./FavoriteTypes"));
const OrderTypes_1 = __importDefault(require("./OrderTypes"));
const ProductTypes_1 = __importDefault(require("./ProductTypes"));
const InboxTypes_1 = __importDefault(require("./InboxTypes"));
var rootTypes = (0, graphql_tag_1.gql) `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;
const types = [
    AuthTypes_1.default,
    ProductTypes_1.default,
    FavoriteTypes_1.default,
    BannersTypes_1.default,
    OrderTypes_1.default,
    AddressTypes_1.default,
    rootTypes,
    CustomTypes_1.default,
    EmployeeTypes_1.default,
    CouponTypes_1.default,
    InboxTypes_1.default
];
exports.default = (0, merge_1.mergeTypeDefs)(types);
