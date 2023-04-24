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
const context_1 = require("../../../context");
const clear_id_1 = __importDefault(require("../../../helper/clear_id"));
const formatJson_1 = __importDefault(require("../../../helper/formatJson"));
const redisGet_1 = __importDefault(require("../../../helper/redisGet"));
const users = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit = 10, employee = false } = args.input;
        const { addressLoader, redis, user } = ctx;
        let skip = (page - 1) * limit;
        const { db, req } = ctx;
        if (employee && !req.admin)
            throw new Error("Permission denied");
        const key = `users:${user === null || user === void 0 ? void 0 : user._id.toString()}?page=${page}&employee=${employee}`;
        // getting cache data from redis if available
        const redisCache = yield (0, redisGet_1.default)(key);
        // if redis cache is available
        if (redisCache)
            return redisCache;
        // finding users
        const data = (0, formatJson_1.default)(yield db.users.find(employee
            ? { level: { $in: ["Gold", "Silver", "Bronze"] } }
            : { level: null }, context_1.userSelect, { limit, skip }));
        // getting users id
        const ids = data.map((d) => d.id);
        // finding users addresses with there id
        const addresses = yield addressLoader.loadMany(ids);
        // merging addresses with users
        const results = data.map((d) => (Object.assign(Object.assign({}, d), { addresses: (0, clear_id_1.default)(addresses.filter((ad) => ad.userId === d.id)) })));
        // getting total length of users
        const totalItems = yield db.users.count();
        const returnResult = {
            page,
            totalItems,
            results,
        };
        // cache users to redis
        yield redis.setex(key, 3600, JSON.stringify(returnResult));
        return returnResult;
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = users;
//# sourceMappingURL=users.js.map