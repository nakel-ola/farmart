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
const removeFromFavorites = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { db, user, redis } = ctx;
        const userId = user === null || user === void 0 ? void 0 : user._id.toString();
        const favorite = yield db.favorites.findOne({ userId });
        if (!favorite)
            throw new Error("Something went wrong");
        yield db.favorites.updateOne({ userId }, { $pull: { data: args.id } });
        // getting cache data from redis if available
        yield (0, getdel_1.default)([
            `favorite:${userId}*`,
            `favorites:${userId}*`,
            `products:${userId}*`,
            `product:${userId}*`,
            `product-search:${userId}*`,
        ]);
        return { message: "Product removed from favorite" };
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = removeFromFavorites;
//# sourceMappingURL=remove-from-favorites.js.map