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
const generateCode_1 = __importDefault(require("../../../helper/generateCode"));
const forgetPassword = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name } = args.input;
        const { db } = ctx;
        let token = (0, generateCode_1.default)(11111, 99999);
        const user = yield db.users.findOne({ email, name });
        if (!user)
            throw (0, exceptions_1.NotFoundException)("User not found");
        const key = `validate-user:${email}:${name}`;
        let obj = { email, token };
        yield ctx.redis.setex(key, 600, JSON.stringify(obj));
        yield (0, emailer_1.default)({
            from: config_1.default.email_from,
            to: email,
            subject: `Your ${config_1.default.app_name} app verification code`,
            html: (0, emailData_1.verificationMail)({ code: token, name }),
        });
        console.log(token);
        return { token: token.toString() };
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = forgetPassword;
//# sourceMappingURL=forget-password.js.map