"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const employeeSchema = new mongoose_1.Schema({
    email: {
        type: mongoose_1.SchemaTypes.String,
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
        required: true,
    },
    gender: {
        type: mongoose_1.SchemaTypes.String,
        required: false,
    },
    birthday: {
        type: mongoose_1.SchemaTypes.Date,
        required: false,
    },
    phoneNumber: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
    },
    level: {
        type: mongoose_1.SchemaTypes.Mixed,
        required: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("employees", employeeSchema);
