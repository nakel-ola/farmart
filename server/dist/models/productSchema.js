"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ratingSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
});
const currencySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
    },
    symbolNative: {
        type: String,
        required: false,
    },
    decimalDigits: {
        type: Number,
        required: true,
    },
    rounding: {
        type: Number,
        required: false,
    },
    code: {
        type: String,
        required: true,
    },
    namePlural: {
        type: String,
        required: true,
    },
});
const productSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    rating: {
        type: [ratingSchema],
        required: true,
    },
    discount: {
        type: String,
        required: false,
    },
    currency: {
        type: currencySchema,
        required: true,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("products", productSchema);
//# sourceMappingURL=productSchema.js.map