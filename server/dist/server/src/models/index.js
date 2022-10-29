"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userSchema_1 = __importDefault(require("./userSchema"));
const validateSchema_1 = __importDefault(require("./validateSchema"));
const productSchema_1 = __importDefault(require("./productSchema"));
const bannerSchema_1 = __importDefault(require("./bannerSchema"));
const favoriteSchema_1 = __importDefault(require("./favoriteSchema"));
const orderSchema_1 = __importDefault(require("./orderSchema"));
const couponSchema_1 = __importDefault(require("./couponSchema"));
const categorySchema_1 = __importDefault(require("./categorySchema"));
const employeeSchema_1 = __importDefault(require("./employeeSchema"));
const inboxSchema_1 = __importDefault(require("./inboxSchema"));
const inviteSchema_1 = __importDefault(require("./inviteSchema"));
exports.default = {
    userSchema: userSchema_1.default,
    validateSchema: validateSchema_1.default,
    productSchema: productSchema_1.default,
    bannerSchema: bannerSchema_1.default,
    favoriteSchema: favoriteSchema_1.default,
    orderSchema: orderSchema_1.default,
    couponSchema: couponSchema_1.default,
    categorySchema: categorySchema_1.default,
    employeeSchema: employeeSchema_1.default,
    inboxSchema: inboxSchema_1.default,
    inviteSchema: inviteSchema_1.default
};
