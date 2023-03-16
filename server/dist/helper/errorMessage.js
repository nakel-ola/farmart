"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMessage = (err) => {
    if (err.errors) {
        const errorMsg = err.errors.map((error) => error.message).join(",");
        return errorMsg;
    }
    return err.message;
};
exports.default = errorMessage;
