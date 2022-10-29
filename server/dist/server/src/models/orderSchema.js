"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema_1 = require("./userSchema");
const productSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
const progressSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    checked: {
        type: Boolean,
        required: true,
    }
}, { timestamps: true });
const orderSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    deliveryMethod: {
        type: String,
        required: true,
    },
    address: {
        type: userSchema_1.addressSchema,
        required: true,
    },
    products: {
        type: [productSchema],
        required: true,
    },
    trackingId: {
        type: String,
        required: true,
    },
    paymentId: {
        type: String,
        required: true,
    },
    progress: {
        type: [progressSchema],
        required: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("orders", orderSchema);
