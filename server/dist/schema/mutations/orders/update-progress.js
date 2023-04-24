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
const updateProgress = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name } = args.input;
        const { db, redis, user } = ctx;
        const userId = user === null || user === void 0 ? void 0 : user._id.toString();
        yield db.orders.updateOne({ _id: id, "progress.name": name }, {
            status: name,
            $set: { "progress.$.name": name, "progress.$.checked": true },
        });
        // getting cache data from redis if available
        yield (0, getdel_1.default)([
            `filterById:${userId}*`,
            `filterByStatus:${userId}*`,
            `order:${userId}*`,
            `orders:${userId}*`,
            "orders-statistics",
            "order-summary",
        ]);
        return { message: "Update successful" };
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = updateProgress;
//# sourceMappingURL=update-progress.js.map