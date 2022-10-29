"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = __importDefault(require("console"));
const xss_1 = __importDefault(require("xss"));
const helper_1 = require("../helper");
const authenticated_1 = __importDefault(require("../middleware/authenticated"));
const models_1 = __importDefault(require("../models"));
const mongoose_1 = __importDefault(require("mongoose"));
let alphabet = "useandom26T198340PX75pxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict";
const verifyCoupon = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = (0, xss_1.default)(req.userId), input = args.input, coupon = (0, xss_1.default)(input.coupon), email = (0, xss_1.default)(input.email), customerId = (0, xss_1.default)(input.customerId);
        const code = models_1.default.couponSchema.findOne({
            userId: customerId !== null && customerId !== void 0 ? customerId : userId,
            email,
            coupon,
        });
        if (!code) {
            throw new Error("Invalid coupon code");
        }
        return code;
    }
    catch (e) {
        console_1.default.log(e);
        throw new Error(e.message);
    }
}));
const coupons = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = (0, xss_1.default)(req.userId), customerId = (0, xss_1.default)(args === null || args === void 0 ? void 0 : args.customerId);
        const code = models_1.default.couponSchema.find({ userId: customerId !== null && customerId !== void 0 ? customerId : userId });
        return code !== null && code !== void 0 ? code : [];
    }
    catch (e) {
        console_1.default.log(e);
        throw new Error(e.message);
    }
}));
const createCoupon = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = req.admin, discount = (0, xss_1.default)(args.input.discount.toString()), email = (0, xss_1.default)(args.input.email), description = (0, xss_1.default)(args.input.description), userId = (0, xss_1.default)(args.input.userId), expiresIn = args.input.expiresIn, coupon = (0, helper_1.nanoidV2)(alphabet, 9);
        if (!admin) {
            throw new Error("You don't have permission to create coupon");
        }
        const data = yield models_1.default.couponSchema.create({
            discount,
            email,
            description,
            userId,
            coupon,
            expiresIn,
        });
        if (data) {
            return {
                msg: "Coupon created successfully",
            };
        }
    }
    catch (err) {
        console_1.default.log(err);
        throw new Error(err.message);
    }
}));
const deleteCoupon = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = req.admin, id = args.id;
        console_1.default.log(id);
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error("User ID must be a valid");
        }
        if (!admin) {
            throw new Error("You don't have permission to create coupon");
        }
        const data = yield models_1.default.couponSchema.deleteOne({ _id: id });
        if (data) {
            return {
                msg: "Coupon deleted successfully",
            };
        }
    }
    catch (err) {
        console_1.default.log(err);
        throw new Error(err.message);
    }
}));
exports.default = {
    verifyCoupon,
    coupons,
    createCoupon,
    deleteCoupon,
};
