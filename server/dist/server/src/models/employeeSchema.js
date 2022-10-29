"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const employeeSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    photoUrl: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: false,
    },
    birthday: {
        type: Date,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    level: {
        type: String,
        required: true,
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("employees", employeeSchema);
