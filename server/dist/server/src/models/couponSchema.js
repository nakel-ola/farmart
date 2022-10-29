"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const couponSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    coupon: {
        type: String,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    userId: {
        type: String,
        required: true,
    },
    expiresIn: {
        type: Date,
        required: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('coupons', couponSchema);
