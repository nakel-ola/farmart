"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_address_1 = __importDefault(require("./create-address"));
const delete_address_1 = __importDefault(require("./delete-address"));
const update_address_1 = __importDefault(require("./update-address"));
exports.default = { createAddress: create_address_1.default, updateAddress: update_address_1.default, deleteAddress: delete_address_1.default };
//# sourceMappingURL=index.js.map