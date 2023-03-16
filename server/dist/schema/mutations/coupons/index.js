"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_coupon_1 = __importDefault(require("./create-coupon"));
const delete_coupon_1 = __importDefault(require("./delete-coupon"));
exports.default = { createCoupon: create_coupon_1.default, deleteCoupon: delete_coupon_1.default };
