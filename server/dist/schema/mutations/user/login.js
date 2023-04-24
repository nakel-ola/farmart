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
const signToken_1 = __importDefault(require("../../../helper/signToken"));
const login = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = args.input;
        const { db, req } = ctx;
        // checking if user with email exists
        const user = yield db.users.findOne({ email }, { blocked: 1, password: 1 });
        // if user with email not exists throw error
        if (!user)
            throw new Error("Something went wrong");
        // checking if existing user is blocked if blocked throw error
        if (user === null || user === void 0 ? void 0 : user.blocked)
            throw new Error("Account blocked");
        // comparing entered password with db password
        const isPassword = (0, bcryptjs_1.compareSync)(password, user.password);
        // if entered password is not equal to db password throw error
        if (!isPassword)
            throw new Error("Something went wrong");
        // signing token with id and email
        let token = (0, signToken_1.default)(user._id.toString(), email);
        // updating cookie
        req.session.auth = token;
        return { message: "Login successful" };
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = login;
//# sourceMappingURL=login.js.map