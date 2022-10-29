"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const xss_1 = __importDefault(require("xss"));
const config_1 = __importDefault(require("../config"));
const mongoose_1 = __importDefault(require("mongoose"));
const authenticated = fn => (args, req) => {
    var _a;
    try {
        var token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        var decodedToken = jsonwebtoken_1.default.verify((0, xss_1.default)(token), config_1.default.jwt_key);
        req.userId = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id)) {
            throw new Error("User ID must be a valid");
        }
        return fn(args, req);
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
};
exports.default = authenticated;
