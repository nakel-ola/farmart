"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const address_1 = __importDefault(require("./address"));
const banners_1 = __importDefault(require("./banners"));
const coupons_1 = __importDefault(require("./coupons"));
const favorites_1 = __importDefault(require("./favorites"));
const inboxes_1 = __importDefault(require("./inboxes"));
const orders_1 = __importDefault(require("./orders"));
const products_1 = __importDefault(require("./products"));
const upload_1 = __importDefault(require("./upload"));
const user_1 = __importDefault(require("./user"));
const Mutations = (0, lodash_merge_1.default)(user_1.default, upload_1.default, products_1.default, banners_1.default, favorites_1.default, coupons_1.default, inboxes_1.default, address_1.default, orders_1.default);
exports.default = Mutations;
