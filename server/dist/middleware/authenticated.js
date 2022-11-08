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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const xss_1 = __importDefault(require("xss"));
const config_1 = __importDefault(require("../config"));
const index_1 = require("./../index");
const authenticated = (fn) => (args, req, res, context, info) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let errorMsg = {
            __typename: "ErrorMsg",
            error: "You don't have permission",
        };
        if (req.headers.cookie) {
            let parse = cookie_1.default.parse(req.headers.cookie);
            console.log(parse);
            if (req.admin && parse.auth) {
                const data = yield getDb((_a = parse.auth) !== null && _a !== void 0 ? _a : "", req.admin);
                req.userId = data.id;
                req.level = data.level;
                return fn(args, req, res, context, info);
            }
            else if (!req.admin && parse.auth) {
                const data = yield getDb((_b = parse.grocery) !== null && _b !== void 0 ? _b : "", req.admin);
                req.userId = data.id;
                req.blocked = data.block;
                return fn(args, req, res, context, info);
            }
        }
        else if (req.headers["userid"] && req.headers["stripe-signature"]) {
            if (mongoose_1.default.Types.ObjectId.isValid(req.headers["userid"].toString())) {
                return fn(args, req, res, context, info);
            }
        }
        return errorMsg;
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
});
const getDb = (value, admin) => new Promise((resolve, reject) => {
    var data = cookie_parser_1.default.signedCookie(value, config_1.default.session_key);
    index_1.MemoryStore.get(data, (err, session) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (err)
            reject(err === null || err === void 0 ? void 0 : err.message);
        var decodedToken = jsonwebtoken_1.default.verify((0, xss_1.default)((_a = session === null || session === void 0 ? void 0 : session.auth) !== null && _a !== void 0 ? _a : ""), config_1.default.jwt_key);
        if (!mongoose_1.default.Types.ObjectId.isValid(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id)) {
            reject("User ID must be a valid");
        }
        resolve(decodedToken);
    }));
});
exports.default = authenticated;
