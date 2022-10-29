"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressSchema = void 0;
const mongoose_1 = require("mongoose");
var emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const addressSchema = new mongoose_1.Schema({
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
    admin: {
        type: mongoose_1.SchemaTypes.Boolean,
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
}, { timestamps: true });
exports.addressSchema = addressSchema;
const userSchema = new mongoose_1.Schema({
    email: {
        type: mongoose_1.SchemaTypes.String,
        match: emailRegex,
        trim: true,
        required: true,
    },
    name: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
    },
    photoUrl: {
        type: mongoose_1.SchemaTypes.String,
        required: false,
    },
    password: {
        type: mongoose_1.SchemaTypes.String,
        required: true
    },
    gender: {
        type: mongoose_1.SchemaTypes.String,
        required: false,
    },
    birthday: {
        type: mongoose_1.SchemaTypes.String,
        required: false,
    },
    phoneNumber: {
        type: mongoose_1.SchemaTypes.String,
        required: false,
    },
    admin: {
        type: mongoose_1.SchemaTypes.Boolean,
        required: false,
    },
    addresses: {
        type: [addressSchema],
        required: false,
    },
    blocked: {
        type: mongoose_1.SchemaTypes.Boolean,
        required: true,
    }
}, { timestamps: true, });
exports.default = (0, mongoose_1.model)('users', userSchema);
