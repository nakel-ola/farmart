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
require("../../../helper/clear_id");
const formatJson_1 = __importDefault(require("../../../helper/formatJson"));
const redisGet_1 = __importDefault(require("../../../helper/redisGet"));
const productsById = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { redis, productLoader, user } = ctx;
        const key = `product${user ? `:${(_a = user._id) === null || _a === void 0 ? void 0 : _a.toString()}` : ""}:${args.ids.join(",")}`;
        // getting cache data from redis if available
        const redisCache = yield (0, redisGet_1.default)(key);
        // if redis cache is available
        if (redisCache)
            return redisCache;
        // find product from db
        const data = (0, formatJson_1.default)((yield productLoader.loadMany(args.ids)));
        if (!data)
            throw new Error(`Something went wrong`);
        // cache product to redis
        yield redis.setex(key, 3600, JSON.stringify(data));
        return data;
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = productsById;
