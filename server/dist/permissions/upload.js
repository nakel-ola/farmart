"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMutation = void 0;
const user_1 = require("./user");
const uploadMutation = {
    uploadFile: user_1.isAuthenticated,
};
exports.uploadMutation = uploadMutation;
