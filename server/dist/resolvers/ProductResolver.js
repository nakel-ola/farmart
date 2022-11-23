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
const currencies_json_1 = __importDefault(require("../data/currencies.json"));
const clean_1 = __importDefault(require("../helper/clean"));
const ImageUpload_1 = __importDefault(require("../helper/ImageUpload"));
const authenticated_1 = __importDefault(require("../middleware/authenticated"));
const models_1 = __importDefault(require("../models"));
const products = (args, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        let genre = args.input.genre ? (0, xss_1.default)(args.input.genre) : null, offset = Number((0, xss_1.default)((_a = args.input.offset.toString()) !== null && _a !== void 0 ? _a : "0")), limit = Number((0, xss_1.default)((_b = args.input.limit.toString()) !== null && _b !== void 0 ? _b : "10")) + offset, outOfStock = (_c = args.input) === null || _c === void 0 ? void 0 : _c.outOfStock;
        let filter = (0, clean_1.default)({
            stock: outOfStock ? 0 : null,
            category: genre !== null && genre !== void 0 ? genre : null,
        });
        let data = yield models_1.default.productSchema.find(filter);
        let newData = {
            genre,
            totalItems: data.length,
            results: data.slice(offset, limit),
        };
        return newData;
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
});
const product = (args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let slug = (0, xss_1.default)(args.slug);
        const data = (yield models_1.default.productSchema.findOne({ slug }));
        return data;
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
});
const productById = (args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = (0, xss_1.default)(args.id);
        const data = (yield models_1.default.productSchema.findOne({ _id: id }));
        return data;
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
});
const productSearch = (args) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f, _g;
    try {
        let search = (0, xss_1.default)(args.input.search), price = args.input.price
            ? (_d = args.input.price) === null || _d === void 0 ? void 0 : _d.map((value) => Number((0, xss_1.default)(value.toString())))
            : [0, Infinity], discount = args.input.discount
            ? args.input.discount.map((value) => (0, xss_1.default)(value))
            : null, category = args.input.category
            ? args.input.category.map((value) => (0, xss_1.default)(value))
            : null, rating = args.input.rating
            ? Number((0, xss_1.default)(args.input.rating.toString()))
            : 0, offset = Number((0, xss_1.default)((_e = args.input.offset.toString()) !== null && _e !== void 0 ? _e : "0")), limit = Number((0, xss_1.default)((_f = args.input.limit.toString()) !== null && _f !== void 0 ? _f : "10")) + offset, outOfStock = (_g = args.input) === null || _g === void 0 ? void 0 : _g.outOfStock;
        let filter = (0, clean_1.default)({
            price: { $lte: price[1], $gte: price[0] },
            discount: discount ? { $in: discount } : null,
            category: category ? { $in: category } : null,
            stock: outOfStock ? 0 : null,
            $or: [
                { title: new RegExp(search, "i") },
                { category: new RegExp(search, "i") },
            ],
        });
        const data = (yield models_1.default.productSchema.find(filter));
        let newData = {
            search,
            totalItems: data.length,
            results: data.slice(offset, limit),
        };
        return newData;
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
});
const categories = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield models_1.default.categorySchema.find();
        return data;
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
});
const createCategories = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = req.admin, categories = args.categories.map((category) => ({
            name: (0, xss_1.default)(category),
        }));
        if (!admin) {
            throw new Error("You don't have permission to create categories");
        }
        yield models_1.default.categorySchema.insertMany(categories);
        return { msg: "Categories added successfully" };
    }
    catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}));
const deleteCategories = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = req.admin, categories = args.categories.map((category) => ({
            name: (0, xss_1.default)(category),
        }));
        if (!admin) {
            throw new Error("You don't have permission to delete categories");
        }
        for (let i = 0; i < categories.length; i++) {
            const element = categories[i];
            yield models_1.default.categorySchema.deleteOne({ name: element.name });
        }
        return { msg: "Categories deleted successfully" };
    }
    catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
}));
const createReview = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = req.userId, input = args.input, name = (0, xss_1.default)(input.name), productId = (0, xss_1.default)(input.productId), title = (0, xss_1.default)(input.title), rating = Number((0, xss_1.default)(input.rating.toString())), message = (0, xss_1.default)(input.message);
        if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
            throw new Error("ID must be a valid");
        }
        const newReview = {
            name,
            userId,
            title,
            rating,
            message,
        };
        yield models_1.default.productSchema.updateOne({ _id: productId }, { $push: { reviews: newReview } });
        yield models_1.default.productSchema.updateOne({ "rating.name": rating }, { $inc: { "rating.$.value": 1 } });
        return { msg: "Successfully added review" };
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}));
const deleteReview = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = req.admin, userId = req.userId, productId = args.input.productId, reviewId = args.input.reviewId;
        if (!mongoose_1.default.Types.ObjectId.isValid(reviewId)) {
            throw new Error("Review ID must be a valid");
        }
        if (admin) {
            yield models_1.default.productSchema.updateOne({ _id: productId }, { $pull: { reviews: { _id: reviewId } } });
        }
        else {
            yield models_1.default.productSchema.updateOne({ _id: productId }, { $pull: { reviews: { _id: reviewId, userId } } });
        }
        return { msg: "Successfully deleted review" };
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}));
const reviews = (args) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    try {
        let productId = (0, xss_1.default)(args.productId);
        if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
            throw new Error("Porduct ID must be a valid");
        }
        const data = (yield models_1.default.productSchema.findOne({ _id: productId }, { reviews: 1 }));
        return (_h = data.reviews) !== null && _h !== void 0 ? _h : [];
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
});
const createProduct = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = req.admin, input = args.input, title = (0, xss_1.default)(input.title), slug = (0, xss_1.default)(input.slug), category = (0, xss_1.default)(input.category), description = (0, xss_1.default)(input.description), image = input.image, price = Number((0, xss_1.default)(`${input.price}`)), stock = Number((0, xss_1.default)(`${input.stock}`)), rating = [
            {
                name: "5",
                value: 0,
            },
            {
                name: "4",
                value: 0,
            },
            {
                name: "3",
                value: 0,
            },
            {
                name: "2",
                value: 0,
            },
            {
                name: "1",
                value: 0,
            },
        ], currency = currencies_json_1.default[0], reviews = [];
        if (!admin) {
            throw new Error("You don't have permission to create products");
        }
        const newImage = yield (0, ImageUpload_1.default)(image.file);
        const data = {
            title,
            slug,
            category,
            description,
            image: newImage,
            price,
            stock,
            rating,
            currency,
            reviews,
        };
        console.log(data);
        const newData = yield models_1.default.productSchema.create(data);
        if (newData) {
            return { msg: "Created successfully" };
        }
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}));
const modifyProduct = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k;
    try {
        let admin = req.admin, input = args.input, id = (0, xss_1.default)(input.id), title = (0, xss_1.default)(input.title), slug = (0, xss_1.default)(input.slug), category = (0, xss_1.default)(input.category), description = (0, xss_1.default)(input.description), image = (input === null || input === void 0 ? void 0 : input.image)
            ? {
                name: (0, xss_1.default)((_j = input === null || input === void 0 ? void 0 : input.image) === null || _j === void 0 ? void 0 : _j.name),
                url: (0, xss_1.default)((_k = input === null || input === void 0 ? void 0 : input.image) === null || _k === void 0 ? void 0 : _k.url),
            }
            : null, imageUpload = input.imageUpload, price = Number((0, xss_1.default)(`${input.price}`)), stock = Number((0, xss_1.default)(`${input.stock}`)), currency = {
            name: (0, xss_1.default)(input.currency.name),
            symbol: (0, xss_1.default)(input.currency.symbol),
            symbolNative: (0, xss_1.default)(input.currency.symbolNative),
            decimalDigits: (0, xss_1.default)(`${input.currency.decimalDigits}`),
            rounding: (0, xss_1.default)(`${input.currency.rounding}`),
            code: (0, xss_1.default)(input.currency.code),
            namePlural: (0, xss_1.default)(input.currency.namePlural),
        };
        if (!admin) {
            throw new Error("Something went wrong");
        }
        const newImage = image !== null && image !== void 0 ? image : (yield (0, ImageUpload_1.default)(imageUpload.file));
        const user = yield models_1.default.productSchema.updateOne({ _id: id }, {
            title,
            slug,
            category,
            description,
            image: newImage,
            price,
            stock,
            currency,
        });
        console.log(user);
        if (!user) {
            throw new Error("Something went wrong");
        }
        return { msg: "Successfully updated" };
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}));
const deleteProduct = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = req.admin, id = (0, xss_1.default)(args.id);
        if (!admin) {
            throw new Error("Something went wrong");
        }
        const data = yield models_1.default.productSchema.deleteOne({ _id: id });
        if (data) {
            return { msg: "Deleted Successfully" };
        }
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}));
const productsSummary = (0, authenticated_1.default)((_, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = req.admin;
        if (!admin) {
            throw new Error("You don,t have permission");
        }
        const products = yield models_1.default.productSchema.find();
        const orders = yield models_1.default.orderSchema.find();
        let totalDelivered = 0;
        for (let i = 0; i < orders.length; i++) {
            let element = orders[i].progress;
            let checked = element.find((r) => r.name.toLowerCase() === "delivered" && r.checked);
            if (checked) {
                totalDelivered += 1;
            }
        }
        const data = {
            __typename: "ProductSummary",
            totalOrders: orders.length,
            totalDelivered,
            totalStock: products.reduce((amount, item) => amount + item.stock, 0),
            outOfStock: products.filter((product) => product.stock === 0).length,
        };
        return data;
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}));
exports.default = {
    products,
    product,
    productSearch,
    categories,
    createReview,
    reviews,
    productById,
    createProduct,
    modifyProduct,
    deleteProduct,
    productsSummary,
    createCategories,
    deleteCategories,
    deleteReview,
};
