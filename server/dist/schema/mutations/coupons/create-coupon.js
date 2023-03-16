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
const generateCoupon_1 = __importDefault(require("../../../helper/generateCoupon"));
const createCoupon = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { discount, email, expiresIn, userId, description } = args.input;
        const { db, user } = ctx;
        const code = (0, generateCoupon_1.default)(9);
        const data = yield db.coupons.create({
            discount,
            email,
            description,
            userId,
            code,
            expiresIn,
        });
        if (!data)
            throw new Error("Something went wrong");
        yield ctx.redis.del(`coupons:${userId !== null && userId !== void 0 ? userId : user === null || user === void 0 ? void 0 : user._id.toString()}`);
        return { message: "Coupon created successfully" };
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = createCoupon;
