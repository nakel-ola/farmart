"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const address_1 = __importDefault(require("./address"));
const addresses_1 = __importDefault(require("./addresses"));
exports.default = {
    address: address_1.default,
    addresses: addresses_1.default,
};
