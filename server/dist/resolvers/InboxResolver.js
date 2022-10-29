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
const mongoose_1 = __importDefault(require("mongoose"));
const xss_1 = __importDefault(require("xss"));
const authenticated_1 = __importDefault(require("../middleware/authenticated"));
const models_1 = __importDefault(require("../models"));
const inboxes = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let userId = req.userId, customerId = (0, xss_1.default)(args.input.customerId), page = Number((0, xss_1.default)((_a = args.input.page.toString()) !== null && _a !== void 0 ? _a : "1")), limit = Number((0, xss_1.default)((_b = args.input.limit.toString()) !== null && _b !== void 0 ? _b : "10")), start = (page - 1) * limit, end = limit + start;
        if (customerId && !mongoose_1.default.Types.ObjectId.isValid(customerId)) {
            throw new Error("ID must be a valid");
        }
        const data = yield models_1.default.inboxSchema.find(customerId ? { userId: customerId } : { userId });
        return {
            page,
            totalItems: data.length,
            results: data.slice(start, end),
        };
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}));
const createInbox = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = req.admin, title = (0, xss_1.default)(args.input.title), description = (0, xss_1.default)(args.input.description), userId = (0, xss_1.default)(args.input.userId);
        if (!admin) {
            throw new Error("You don't have permission to create an inbox");
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error("ID must be a valid");
        }
        yield models_1.default.inboxSchema.create({ title, description, userId });
        return {
            msg: "Inbox created successfully",
        };
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}));
const modifyIndox = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = req.admin, title = (0, xss_1.default)(args.input.title), description = (0, xss_1.default)(args.input.description), id = (0, xss_1.default)(args.input.id), userId = (0, xss_1.default)(args.input.userId);
        if (!admin) {
            throw new Error("You don't have permission to create an inbox");
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error("ID must be a valid");
        }
        yield models_1.default.inboxSchema.updateOne({ _id: id, userId }, { title, description });
        return {
            msg: "Inbox modify successfully"
        };
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}));
exports.default = {
    inboxes,
    createInbox,
    modifyIndox
};
