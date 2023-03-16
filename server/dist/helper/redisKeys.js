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
const context_1 = require("../context");
const redisGet_1 = __importDefault(require("./redisGet"));
const redisKeys = (key, newKey) => __awaiter(void 0, void 0, void 0, function* () {
    const keys = yield (0, redisGet_1.default)(key);
    if (!keys)
        return yield context_1.redis.set(key, JSON.stringify([newKey]));
    const newKeys = [...keys, newKey];
    const seen = new Set();
    const results = newKeys.filter((el) => {
        const duplicate = seen.has(el);
        seen.add(el);
        return !duplicate;
    });
    return yield context_1.redis.set(key, JSON.stringify([results]));
});
exports.default = redisKeys;
