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
        const allowports = config_1.default.allowport.split(",");
        if (allowports.find((port) => port === req.header("Origin"))) {
            req.admin = req.headers.origin === config_1.default.admin_url ? true : req.headers.origin === config_1.default.client_url ? false : null;
            corsOptions = {
                origin: [req.header("Origin")],
                methods: ["GET", "POST"],
                credentials: true,
            };
        }
        else {
            corsOptions = { origin: false };
            // throw new Error("Can't access server");
        }
    }
    catch (err) {
        // console.log(err)
        throw new Error(err.message);
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
};
exports.default = (0, cors_1.default)(corsOptionsDelegate);
