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
const clean_1 = __importDefault(require("../../../helper/clean"));
const createBanner = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ctx.db.banners.create((0, clean_1.default)(args.input));
        yield ctx.redis.del("banners");
        return { message: "Banner created successfully" };
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = createBanner;
