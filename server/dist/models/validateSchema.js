"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validateSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    validationToken: {
        type: String,
        required: true,
    },
    expiresIn: {
        type: Date,
        required: true,
        expires: 300
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("validate", validateSchema);
