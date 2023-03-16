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
const formatJson_1 = __importDefault(require("../../../helper/formatJson"));
const redisGet_1 = __importDefault(require("../../../helper/redisGet"));
const order = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { db, req, user } = ctx;
        const userId = user === null || user === void 0 ? void 0 : user._id.toString();
        const key = `order:${userId}:${args.id}`;
        // getting cache data from redis if available
        const redisCache = yield (0, redisGet_1.default)(key);
        // if redis cache is available
        if (redisCache)
            return redisCache;
        const filter = req.admin ? { _id: args.id } : { _id: args.id, userId };
        const data = yield db.orders.findOne(filter);
        if (!data)
            throw new Error("Something went wrong");
        const newData = (0, formatJson_1.default)(data);
        // cache data to redis
        yield ctx.redis.setex(key, 3600, JSON.stringify(newData));
        return data;
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = order;
