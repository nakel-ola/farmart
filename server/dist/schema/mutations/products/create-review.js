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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const createReview = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = args.input, { productId, rating } = _a, others = __rest(_a, ["productId", "rating"]);
        const { db, user, redis } = ctx;
        const newReview = Object.assign(Object.assign({}, others), { userId: user === null || user === void 0 ? void 0 : user._id.toString(), rating,
            productId });
        yield db.reviews.create(newReview);
        yield db.products.updateOne({ _id: productId, "rating.name": rating }, { $inc: { "rating.$.value": 1 } });
        const key = `reviews:${productId}`;
        yield redis.del(key);
        return { message: "Successfully added review" };
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = createReview;
