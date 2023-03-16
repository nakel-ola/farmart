"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
const config_1 = __importDefault(require("../config"));
const generateHash = (password) => {
    const salt = (0, bcryptjs_1.genSaltSync)(config_1.default.saltRounds);
    const hash = (0, bcryptjs_1.hashSync)(password, salt);
    return hash;
};
exports.default = generateHash;
