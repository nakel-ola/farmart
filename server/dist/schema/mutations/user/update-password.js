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
const bcryptjs_1 = require("bcryptjs");
const emailData_1 = require("../../../data/emailData");
const emailer_1 = __importDefault(require("../../../helper/emailer"));
const exceptions_1 = require("../../../helper/exceptions");
const generateHash_1 = __importDefault(require("../../../helper/generateHash"));
const signToken_1 = __importDefault(require("../../../helper/signToken"));
const updatePassword = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newPassword, oldPassword } = args.input;
        const { db, req, user } = ctx;
        const userId = user === null || user === void 0 ? void 0 : user._id.toString(), email = user === null || user === void 0 ? void 0 : user.email;
        if (newPassword !== oldPassword)
            throw new Error("Passwords do not match");
        const userPs = yield db.users.findOne({ _id: userId }, { password: 1 });
        if (!userPs)
            throw (0, exceptions_1.NotFoundException)("Something went wrong");
        const isPassword = (0, bcryptjs_1.compareSync)(oldPassword, userPs === null || userPs === void 0 ? void 0 : userPs.password);
        if (!isPassword)
            throw new Error("Something went wrong");
        const hash = (0, generateHash_1.default)(newPassword);
        const newUser = yield db.users.updateOne({ _id: userId }, { password: hash });
        if (!newUser)
            throw new Error("Something went wrong");
        req.session.destroy((err) => {
            if (err)
                throw new Error(err.message);
        });
        const token = (0, signToken_1.default)(userId, email);
        req.session.auth = token;
        yield (0, emailer_1.default)({
            from: '"Grocery Team" noreply@grocery.com',
            to: email,
            subject: "	Your password was changed",
            html: (0, emailData_1.passwordChangeMail)({ name: user === null || user === void 0 ? void 0 : user.name, email }),
        });
        return { message: "Password updated successfully" };
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = updatePassword;
