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
const redisKeys_1 = __importDefault(require("../../../helper/redisKeys"));
const favorites = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, offset } = args.input;
        const { db, user, productLoader } = ctx;
        const userId = user === null || user === void 0 ? void 0 : user._id.toString();
        const key = `favorites:${userId}?limit=${limit}&offset=${offset}`;
        // getting cache data from redis if available
        const redisCache = yield (0, redisGet_1.default)(key);
        // if redis cache is available
        if (redisCache)
            return redisCache;
        yield (0, redisKeys_1.default)("favorites-keys", key);
        const favorites = yield db.favorites.findOne({ userId });
        if (!favorites)
            return { totalItems: 0, results: [] };
        const products = (yield productLoader.loadMany(favorites.data));
        const results = favorites.data
            .map((f) => {
            var _a;
            return (Object.assign(Object.assign({}, (_a = products.find((p) => p._id.toString() === f)) === null || _a === void 0 ? void 0 : _a.toJSON()), { favorite: true }));
        })
            .filter((f) => f !== undefined)
            .slice(offset, limit);
        const data = {
            totalItems: favorites.data.length,
            results: (0, clear_id_1.default)(results),
        };
        // cache data to redis
        yield ctx.redis.setex(key, 3600, JSON.stringify(data));
        return data;
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = favorites;
//# sourceMappingURL=favorites.js.map