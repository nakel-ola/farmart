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
const inboxes = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { db, user, req } = ctx;
        const { customerId, limit, page } = args.input;
        const skip = (page - 1) * limit, userId = !req.admin ? user === null || user === void 0 ? void 0 : user._id.toString() : customerId;
        const key = `inboxes:${userId}`;
        // getting cache data from redis if available
        const redisCache = yield (0, redisGet_1.default)(key);
        // if redis cache is available
        if (redisCache)
            return redisCache;
        const results = (0, formatJson_1.default)(yield db.inboxes.find({ userId }, null, { skip, limit }));
        const totalItems = yield db.inboxes.count({ userId });
        const data = { page, totalItems, results };
        // cache data to redis
        yield ctx.redis.setex(key, 3600, JSON.stringify(data));
        return data;
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = inboxes;
