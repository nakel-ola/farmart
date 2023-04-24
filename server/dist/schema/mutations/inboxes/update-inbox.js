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
Object.defineProperty(exports, "__esModule", { value: true });
const updateInbox = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { db, redis, user } = ctx;
        const { description, id, userId, title } = args.input;
        yield db.inboxes.updateOne({ _id: id, userId }, { title, description });
        // getting deleting cache data from redis if available
        yield redis.del(`inboxes:${userId}`);
        return { message: "Inbox modify successfully" };
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = updateInbox;
//# sourceMappingURL=update-inbox.js.map