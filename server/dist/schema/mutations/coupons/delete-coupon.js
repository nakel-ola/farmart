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
Object.defineProperty(exports, "__esModule", { value: true });
const deleteCoupons = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, id } = args.input;
        const { db, redis } = ctx;
        const data = yield db.coupons.deleteOne({ _id: id });
        if (!data)
            throw new Error("Something went wrong");
        yield redis.del(`coupons:${userId}`);
        return { message: "Coupon deleted successfully" };
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = deleteCoupons;
//# sourceMappingURL=delete-coupon.js.map