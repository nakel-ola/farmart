"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bannerSchema = new mongoose_1.Schema({
    image: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: false,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("banners", bannerSchema);
