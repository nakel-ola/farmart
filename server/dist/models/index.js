"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bannerSchema_1 = __importDefault(require("./bannerSchema"));
const categorySchema_1 = __importDefault(require("./categorySchema"));
const couponSchema_1 = __importDefault(require("./couponSchema"));
const favoriteSchema_1 = __importDefault(require("./favoriteSchema"));
const inboxSchema_1 = __importDefault(require("./inboxSchema"));
const inviteSchema_1 = __importDefault(require("./inviteSchema"));
const orderSchema_1 = __importDefault(require("./orderSchema"));
const productSchema_1 = __importDefault(require("./productSchema"));
const userSchema_1 = __importDefault(require("./userSchema"));
const addressSchema_1 = __importDefault(require("./addressSchema"));
const reviewSchema_1 = __importDefault(require("./reviewSchema"));
const db = {
    users: userSchema_1.default,
    products: productSchema_1.default,
    banners: bannerSchema_1.default,
    favorites: favoriteSchema_1.default,
    orders: orderSchema_1.default,
    coupons: couponSchema_1.default,
    categories: categorySchema_1.default,
    inboxes: inboxSchema_1.default,
    invites: inviteSchema_1.default,
    addresses: addressSchema_1.default,
    reviews: reviewSchema_1.default
};
exports.default = db;
//# sourceMappingURL=index.js.map