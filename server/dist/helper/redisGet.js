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
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("../context");
const redisGet = (key) => __awaiter(void 0, void 0, void 0, function* () {
    // getting cache friend-request from redis if available
    const redisCache = yield context_1.redis.get(key);
    // checking if redis cache is not available
    if (!redisCache)
        return null;
    // if redis cache is available
    const parseData = JSON.parse(redisCache);
    // return parsed data
    return parseData;
});
exports.default = redisGet;
//# sourceMappingURL=redisGet.js.map