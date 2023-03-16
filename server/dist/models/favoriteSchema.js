"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const favoriteSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    data: {
        type: [String],
        required: true,
    },
});
exports.default = (0, mongoose_1.model)("favorites", favoriteSchema);
