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
const ordersStatistics = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { db } = ctx;
        const key = `orders-statistics`;
        // getting cache data from redis if available
        const redisCache = yield (0, redisGet_1.default)(key);
        // if redis cache is available
        if (redisCache)
            return redisCache;
        const orders = yield db.orders.find({}, { totalPrice: 1, progress: 1, createdAt: 1, updatedAt: 1 });
        let totals = orders.length > 0 ? orders.map((order) => Number(order.totalPrice)) : [];
        const data = {
            min: 0,
            max: 136 !== null && 136 !== void 0 ? 136 : Math.round(Math.max(...totals)),
            week: [0, 86, 28, 115, 48, 210, 136],
            month: [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35],
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
exports.default = ordersStatistics;
