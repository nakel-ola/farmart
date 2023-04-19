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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clean_1 = __importDefault(require("../../../helper/clean"));
const getDel_1 = __importDefault(require("../../../helper/getDel"));
const updateAddress = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = args.input, { id } = _a, others = __rest(_a, ["id"]);
        const { db, user } = ctx;
        const userId = user === null || user === void 0 ? void 0 : user._id.toString();
        yield db.addresses.updateOne({ userId, _id: id }, (0, clean_1.default)(others));
        yield (0, getDel_1.default)([`addresses:${userId}*`, `*address:${userId}*`]);
        return { message: "Address updated successfully" };
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = updateAddress;