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
const clean_1 = __importDefault(require("../../../helper/clean"));
const clear_id_1 = __importDefault(require("../../../helper/clear_id"));
const redisGet_1 = __importDefault(require("../../../helper/redisGet"));
const productSearch = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { price = [0, Infinity], discount, category, outOfStock, search, offset, limit, } = args.input;
        const { db, user } = ctx;
        const userId = user ? (_a = user === null || user === void 0 ? void 0 : user._id) === null || _a === void 0 ? void 0 : _a.toString() : null;
        const dis = discount ? `&discount=${discount === null || discount === void 0 ? void 0 : discount.join(",")}` : "";
        const cat = category ? `&category=${category === null || category === void 0 ? void 0 : category.join(",")}` : "";
        const priceKey = price ? `&price=${price === null || price === void 0 ? void 0 : price.join(",")}` : "";
        const key = `product-search${userId ? `:${userId}` : ""}:${search}?outOfStock=${outOfStock}&offset=${offset}&limit=${limit}${priceKey}${dis}${cat}`;
        // getting cache data from redis if available
        const redisCache = yield (0, redisGet_1.default)(key);
        // if redis cache is available
        if (redisCache)
            return redisCache;
        let filter = (0, clean_1.default)({
            price: price ? { $lte: price[1], $gte: price[0] } : null,
            discount: discount ? { $in: discount } : null,
            category: category ? { $in: category } : null,
            stock: outOfStock ? 0 : null,
            $or: [
                { title: new RegExp(search, "i") },
                { category: new RegExp(search, "i") },
            ],
        });
        // getting products with the filter
        const results = (yield db.products.find(filter, null, {
            limit,
            skip: offset,
        })).map((r) => r.toJSON());
        // getting total number of product with the filter
        const totalItems = yield db.products.count(filter);
        let newData = {
            search,
            totalItems,
            results: (0, clear_id_1.default)(results),
        };
        // cache product to redis
        yield ctx.redis.setex(key, 3600, JSON.stringify(newData));
        return newData;
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = productSearch;
//# sourceMappingURL=product-search.js.map