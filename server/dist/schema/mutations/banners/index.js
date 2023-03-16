"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_banner_1 = __importDefault(require("./create-banner"));
const delete_banner_1 = __importDefault(require("./delete-banner"));
const edit_banner_1 = __importDefault(require("./edit-banner"));
exports.default = { createBanner: create_banner_1.default, deleteBanner: delete_banner_1.default, editBanner: edit_banner_1.default };
