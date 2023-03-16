"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clear_id_1 = __importDefault(require("./clear_id"));
const formatJson = (data) => {
    if (Array.isArray(data))
        return (0, clear_id_1.default)(data.map((d) => d.toJSON()));
    return (0, clear_id_1.default)(data.toJSON());
};
exports.default = formatJson;
