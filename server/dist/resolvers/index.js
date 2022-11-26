"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const AddressResolver_1 = __importDefault(require("./AddressResolver"));
const AuthResolver_1 = __importDefault(require("./AuthResolver"));
const BannersResolver_1 = __importDefault(require("./BannersResolver"));
const CouponResolver_1 = __importDefault(require("./CouponResolver"));
const CustomResolver_1 = __importDefault(require("./CustomResolver"));
const EmployeeResolver_1 = __importDefault(require("./EmployeeResolver"));
const FavoriteResolver_1 = __importDefault(require("./FavoriteResolver"));
const OrderResolver_1 = __importDefault(require("./OrderResolver"));
const ProductResolver_1 = __importDefault(require("./ProductResolver"));
const InboxResolver_1 = __importDefault(require("./InboxResolver"));
const resolvers = {};
exports.default = (0, lodash_merge_1.default)(resolvers, ProductResolver_1.default, AuthResolver_1.default, FavoriteResolver_1.default, AddressResolver_1.default, OrderResolver_1.default, BannersResolver_1.default, CustomResolver_1.default, EmployeeResolver_1.default, CouponResolver_1.default, InboxResolver_1.default);
