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
const getdel_1 = __importDefault(require("../../../helper/getdel"));
const blockUser = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, blocked, customerId } = args.input;
        const { req, db } = ctx;
        if (!req.admin)
            throw Error("You don't have permission to block this user");
        const user = yield db.users.updateOne({ _id: customerId, email }, { blocked });
        if (!user)
            throw new Error("Something went wrong");
        yield (0, getdel_1.default)([`user:${customerId}`, `auth-user:${customerId}`]);
        return { message: "User Blocked successfully" };
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = blockUser;
//# sourceMappingURL=block-user.js.map