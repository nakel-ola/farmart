"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressSchema = void 0;
const mongoose_1 = require("mongoose");
const addressSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
    },
    name: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
    },
    street: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
    },
    city: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
    },
    state: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
    },
    country: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
    },
    info: {
        type: mongoose_1.SchemaTypes.String,
        required: false,
    },
    phoneNumber: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
    },
    phoneNumber2: {
        type: mongoose_1.SchemaTypes.String,
        required: false,
    },
    default: {
        type: mongoose_1.SchemaTypes.Boolean,
        required: false,
    },
}, { timestamps: true });
exports.addressSchema = addressSchema;
exports.default = (0, mongoose_1.model)("addresses", addressSchema);
