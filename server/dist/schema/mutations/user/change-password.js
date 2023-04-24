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
const config_1 = __importDefault(require("../../../config"));
const emailData_1 = require("../../../data/emailData");
const emailer_1 = __importDefault(require("../../../helper/emailer"));
const exceptions_1 = require("../../../helper/exceptions");
const generateHash_1 = __importDefault(require("../../../helper/generateHash"));
const redisGet_1 = __importDefault(require("../../../helper/redisGet"));
const signToken_1 = __importDefault(require("../../../helper/signToken"));
const changePassword = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, token } = args.input;
        const { db, req, redis } = ctx;
        const user = yield ctx.db.users.findOne({ email }, { id: true, email: true });
        if (!user)
            throw new Error("User not found");
        const key = `validate-user:${email}:${name}`;
        const redisCache = yield (0, redisGet_1.default)(key);
        if (!redisCache)
            throw (0, exceptions_1.UnauthorizedException)("Unauthorized access");
        if (redisCache.token !== token)
            throw (0, exceptions_1.UnauthorizedException)("Invalid token");
        const hash = (0, generateHash_1.default)(password);
        const updatedUser = yield db.users.updateOne({ email, name }, { password: hash });
        if (!updatedUser)
            throw new Error("Something went wrong");
        const jwtToken = (0, signToken_1.default)(user._id.toString(), email);
        req.session.auth = jwtToken;
        yield redis.del(key);
        yield (0, emailer_1.default)({
            from: config_1.default.email_from,
            to: email,
            subject: "Your password was changed",
            html: (0, emailData_1.passwordChangeMail)({ name, email }),
        });
        return { message: "Password changed successfully" };
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = changePassword;
//# sourceMappingURL=change-password.js.map