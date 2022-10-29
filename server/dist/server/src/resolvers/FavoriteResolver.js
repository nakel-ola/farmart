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
const xss_1 = __importDefault(require("xss"));
const authenticated_1 = __importDefault(require("../middleware/authenticated"));
const models_1 = __importDefault(require("../models"));
const mongoose_1 = __importDefault(require("mongoose"));
const favorites = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let userId = (0, xss_1.default)(req.userId);
        let offset = Number((0, xss_1.default)((_a = args.input.offset) !== null && _a !== void 0 ? _a : 0));
        let limit = Number((0, xss_1.default)((_b = args.input.limit) !== null && _b !== void 0 ? _b : 10)) + offset;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error("User ID must be a valid");
        }
        const favorites = yield models_1.default.favoriteSchema.findOne({ userId });
        const products = yield models_1.default.productSchema.find();
        const data = {
            totalItems: favorites ? favorites.data.length : 0,
            results: favorites
                ? favorites.data
                    .map((product) => {
                    return products.find((p) => p._id.toString() === product);
                })
                    .slice(offset, limit)
                : [],
        };
        return data;
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}));
const favorite = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        let id = (0, xss_1.default)(args.id);
        let userId = (0, xss_1.default)(req.userId);
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error("User ID must be a valid");
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error("Product ID must be a valid");
        }
        const favorite = yield models_1.default.favoriteSchema.findOne({ userId });
        const data = (_c = favorite === null || favorite === void 0 ? void 0 : favorite.data) === null || _c === void 0 ? void 0 : _c.find((p) => p === id);
        if (data === undefined) {
            throw new Error("Product not Found");
        }
        return (_d = { id: data }) !== null && _d !== void 0 ? _d : null;
    }
    catch (e) {
        throw new Error(e.message);
    }
}));
const addToFavorites = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = (0, xss_1.default)(args.id);
        let userId = (0, xss_1.default)(req.userId);
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error("User ID must be a valid");
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error("Product ID must be a valid");
        }
        const user = yield models_1.default.favoriteSchema.findOne({ userId });
        if (user) {
            yield models_1.default.favoriteSchema.updateOne({ userId }, { $push: { data: id } });
        }
        else {
            yield models_1.default.favoriteSchema.create({ userId, data: [id] });
        }
        return { msg: "Added" };
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}));
const removeFromFavorites = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = (0, xss_1.default)(args.id);
        let userId = (0, xss_1.default)(req.userId);
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error("User ID must be a valid");
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error("Product ID must be a valid");
        }
        const user = yield models_1.default.favoriteSchema.findOne({ userId });
        if (!user) {
            throw new Error("Who the fuck are u ???");
        }
        else {
            yield models_1.default.favoriteSchema.updateOne({ userId }, { $pull: { data: id } });
            return { msg: "Removed" };
        }
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}));
const removeAllFromFavorites = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = (0, xss_1.default)(req.userId);
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error("User ID must be a valid");
        }
        const user = yield models_1.default.favoriteSchema.updateOne({ userId }, { data: [] });
        console.log(user);
        return { msg: "Removed" };
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}));
const FavoriteResolver = {
    favorite,
    favorites,
    addToFavorites,
    removeFromFavorites,
    removeAllFromFavorites,
};
exports.default = FavoriteResolver;
