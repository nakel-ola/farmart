"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = __importDefault(require("../config"));
const signToken = (userId, email, expires) => {
    const payload = {
        sub: userId,
        email,
    };
    const secret = config_1.default.jwt_key;
    const expiresIn = expires !== null && expires !== void 0 ? expires : config_1.default.expiresIn;
    const token = (0, jsonwebtoken_1.sign)(payload, secret, { expiresIn });
    return token;
};
exports.default = signToken;
//# sourceMappingURL=signToken.js.map