"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    productId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: false,
    },
    message: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
});
exports.default = (0, mongoose_1.model)("reviews", reviewSchema);
