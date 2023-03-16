"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("../config"));
var corsOptionsDelegate = function (req, callback) {
    try {
        var corsOptions;
        const allowedOrigins = [config_1.default.client_url, config_1.default.admin_url];
        const origin = req.headers.origin;
        const isAllow = allowedOrigins.includes(origin);
        console.log(origin);
        if (isAllow) {
            req.admin = origin === config_1.default.admin_url;
            corsOptions = {
                origin: allowedOrigins,
                credentials: true,
                methods: "GET, POST",
                optionsSuccessStatus: 200,
            };
        }
        else {
            corsOptions = { origin: false };
        }
    }
    catch (err) {
        throw new Error(err.message);
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
};
exports.default = (0, cors_1.default)(corsOptionsDelegate);
