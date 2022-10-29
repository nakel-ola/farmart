"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./../../../client/src/pages/api/secret");
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
        default: Date.now,
        required: true,
        expires: 7200
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("validate", validateSchema);
