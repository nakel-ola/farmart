"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_shield_1 = require("graphql-shield");
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const address_1 = require("./address");
const banners_1 = require("./banners");
const coupons_1 = require("./coupons");
const favorite_1 = require("./favorite");
const inboxes_1 = require("./inboxes");
const orders_1 = require("./orders");
const upload_1 = require("./upload");
const user_1 = require("./user");
const products_1 = require("./products");
const permissions = (0, graphql_shield_1.shield)({
    Query: (0, lodash_merge_1.default)({ "*": graphql_shield_1.deny }, user_1.userQuery, banners_1.bannerQuery, favorite_1.favoriteQuery, coupons_1.couponsQuery, inboxes_1.inboxesQuery, orders_1.ordersQuery, address_1.addressQuery, products_1.productsQuery),
    Mutation: (0, lodash_merge_1.default)({ "*": graphql_shield_1.deny }, user_1.userMutation, upload_1.uploadMutation, banners_1.bannerMutation, favorite_1.favoriteMutation, coupons_1.couponsMutation, inboxes_1.inboxesMutation, orders_1.ordersMutation, address_1.addressMutation, products_1.productsMutation),
}, { allowExternalErrors: true });
exports.default = permissions;
//# sourceMappingURL=index.js.map