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
const products = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { genre, limit, offset, outOfStock } = args.input;
        const { db, req, user } = ctx;
        if (outOfStock && !req.admin)
            throw new Error("You dont have admin permission");
        const userId = user ? (_a = user === null || user === void 0 ? void 0 : user._id) === null || _a === void 0 ? void 0 : _a.toString() : null;
        const key = `products${userId ? `:${userId}` : ""}${genre ? `:${genre}` : ""}?offset=${offset}&limit=${limit}${outOfStock ? "&outOfStock=${outOfStock}" : ""}`;
        // getting cache data from redis if available
        const redisCache = yield (0, redisGet_1.default)(key);
        // if redis cache is available
        if (redisCache)
            return redisCache;
        let filter = (0, clean_1.default)({ stock: outOfStock ? 0 : null, category: genre });
        let data = yield db.products.find(filter, null, { limit, skip: offset });
        const favorites = user ? yield db.favorites.findOne({ userId }) : null;
        const getFavorite = (id) => !!(favorites === null || favorites === void 0 ? void 0 : favorites.data.find((f) => f === id));
        const results = data.map((d) => (Object.assign(Object.assign({}, d.toJSON()), { favorite: favorites ? getFavorite(d._id.toString()) : false })));
        let totalItems = yield db.products.count(filter);
        let newData = {
            genre: genre,
            totalItems,
            results: (0, clear_id_1.default)(results),
        };
        // cache products to redis
        yield ctx.redis.setex(key, 3600, JSON.stringify(newData));
        return newData;
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = products;
