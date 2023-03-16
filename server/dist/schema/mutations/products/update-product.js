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
const updateProduct = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = args.input, { id } = _a, others = __rest(_a, ["id"]);
        const { db, redis } = ctx;
        const data = (0, clean_1.default)(others);
        const user = yield db.products.updateOne({ _id: id }, data);
        if (!user)
            throw new Error("Something went wrong");
        // getting cache data from redis if available
        yield (0, getDel_1.default)([
            `products*`,
            "product-summary",
            "product*",
            "product-search*",
            "favorite*",
            "favorites*",
        ]);
        return { message: "Successfully updated" };
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = updateProduct;
