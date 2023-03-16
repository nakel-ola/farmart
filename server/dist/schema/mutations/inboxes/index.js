"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_inbox_1 = __importDefault(require("./create-inbox"));
const update_inbox_1 = __importDefault(require("./update-inbox"));
exports.default = { createInbox: create_inbox_1.default, updateInbox: update_inbox_1.default };
