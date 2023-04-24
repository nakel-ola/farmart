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
const redisGet_1 = __importDefault(require("../../../helper/redisGet"));
const ordersSummary = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { db } = ctx;
        const key = `order-summary`;
        // getting cache data from redis if available
        const redisCache = yield (0, redisGet_1.default)(key);
        // if redis cache is available
        if (redisCache)
            return redisCache;
        const orders = yield db.orders.find();
        const data = {
            pending: orders.filter((order) => order.status === "pending").length,
            delivered: orders.filter((order) => order.status === "delivered").length,
            canceled: orders.filter((order) => order.status === "canceled").length,
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
exports.default = ordersSummary;
//# sourceMappingURL=orders-summary.js.map