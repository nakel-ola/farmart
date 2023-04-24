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
const clear_id_1 = __importDefault(require("../../../helper/clear_id"));
const redisGet_1 = __importDefault(require("../../../helper/redisGet"));
const product = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { user, redis, db } = ctx;
        const userId = user ? (_a = user === null || user === void 0 ? void 0 : user._id) === null || _a === void 0 ? void 0 : _a.toString() : null;
        const key = `product${userId ? `:${userId}` : ""}:${args.slug}`;
        // getting cache data from redis if available
        const redisCache = yield (0, redisGet_1.default)(key);
        // if redis cache is available
        if (redisCache)
            return redisCache;
        const data = yield db.products.findOne({ slug: args.slug });
        if (!data)
            return null;
        // finding the favorite form the product
        const favorites = user
            ? yield db.favorites.findOne({
                userId: user === null || user === void 0 ? void 0 : user._id.toString(),
            })
            : null;
        const isFavorite = !!(favorites === null || favorites === void 0 ? void 0 : favorites.data.find((f) => f === data._id.toString()));
        const results = (0, clear_id_1.default)(Object.assign(Object.assign({}, data.toJSON()), { favorite: favorites ? isFavorite : false }));
        // cache product to redis
        yield redis.setex(key, 3600, JSON.stringify(results));
        return results;
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = product;
//# sourceMappingURL=product.js.map