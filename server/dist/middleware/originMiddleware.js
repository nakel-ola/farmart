"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const originMiddleware = (req, res, next) => {
    const allowedOrigins = [config_1.default.client_url, config_1.default.admin_url];
    const origin = req.headers.origin;
    const isAllow = allowedOrigins.includes(origin);
    if (isAllow)
        res.setHeader("Access-Control-Allow-Origin", origin);
    return next();
};
exports.default = originMiddleware;
