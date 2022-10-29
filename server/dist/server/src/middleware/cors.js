"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("../config"));
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    const allowports = config_1.default.allowport.split(',');
    if (allowports.find(port => port === req.header("Origin"))) {
        corsOptions = { origin: true };
        req.admin = req.headers.origin === config_1.default.admin_url ? true : false;
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
};
exports.default = (0, cors_1.default)(corsOptionsDelegate);
