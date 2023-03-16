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
const cookie_1 = __importDefault(require("cookie"));
const cookie_parser_1 = require("cookie-parser");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = __importDefault(require("../config"));
const context_1 = require("../context");
const redisGet_1 = __importDefault(require("../helper/redisGet"));
const loaders_1 = require("../loaders");
const authenticated = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.cookie)
            return null;
        const token = yield getToken(req.headers.cookie);
        if (!token)
            return null;
        const decodedToken = (0, jsonwebtoken_1.verify)(token, config_1.default.jwt_key);
        if (!decodedToken)
            return null;
        let key = `auth-user:${decodedToken.sub}`;
        const redisUser = yield (0, redisGet_1.default)(key);
        if (redisUser)
            return redisUser;
        const user = yield loaders_1.userLoader.load(decodedToken.sub);
        yield context_1.redis.setex(key, 3600, JSON.stringify(user));
        return user;
    }
    catch (error) {
        console.log(error);
    }
    return null;
});
const getToken = (headerCookie) => __awaiter(void 0, void 0, void 0, function* () {
    const parser = cookie_1.default.parse(headerCookie);
    const key = (0, cookie_parser_1.signedCookie)(parser[config_1.default.session_name], config_1.default.session_key);
    const redisKey = `${config_1.default.session_prefix}${key}`;
    const token = yield (0, redisGet_1.default)(redisKey);
    if (!token)
        return null;
    return token === null || token === void 0 ? void 0 : token.auth;
});
exports.default = authenticated;
