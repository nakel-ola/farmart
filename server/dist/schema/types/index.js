"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const merge_1 = require("@graphql-tools/merge");
const graphql_tag_1 = require("graphql-tag");
const address_types_1 = __importDefault(require("./address.types"));
const banners_types_1 = __importDefault(require("./banners.types"));
const coupon_types_1 = __importDefault(require("./coupon.types"));
const custom_types_1 = __importDefault(require("./custom.types"));
const favorites_types_1 = __importDefault(require("./favorites.types"));
const inboxes_types_1 = __importDefault(require("./inboxes.types"));
const orders_types_1 = __importDefault(require("./orders.types"));
const products_types_1 = __importDefault(require("./products.types"));
const upload_types_1 = __importDefault(require("./upload.types"));
const user_types_1 = __importDefault(require("./user.types"));
var rootTypes = (0, graphql_tag_1.gql) `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;
const types = [
    rootTypes,
    custom_types_1.default,
    user_types_1.default,
    upload_types_1.default,
    products_types_1.default,
    banners_types_1.default,
    favorites_types_1.default,
    coupon_types_1.default,
    inboxes_types_1.default,
    orders_types_1.default,
    address_types_1.default,
];
exports.default = (0, merge_1.mergeTypeDefs)(types);
//# sourceMappingURL=index.js.map