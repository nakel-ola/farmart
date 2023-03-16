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
const categories = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const key = "categories";
        // getting cache data from redis if available
        const redisCache = yield (0, redisGet_1.default)(key);
        // if redis cache is available
        if (redisCache)
            return redisCache;
        // if no cache
        const data = (yield ctx.db.categories.find({})).map((d) => d.toJSON());
        // cache data to redis
        yield ctx.redis.setex(key, 3600, JSON.stringify((0, clear_id_1.default)(data)));
        return data;
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = categories;
