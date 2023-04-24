"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const inviteSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    inviteCode: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("invites", inviteSchema);
//# sourceMappingURL=inviteSchema.js.map