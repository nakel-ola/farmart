"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const add_to_favorites_1 = __importDefault(require("./add-to-favorites"));
const remove_all_from_favorites_1 = __importDefault(require("./remove-all-from-favorites"));
const remove_from_favorites_1 = __importDefault(require("./remove-from-favorites"));
exports.default = { addToFavorites: add_to_favorites_1.default, removeFromFavorites: remove_from_favorites_1.default, removeAllFromFavorites: remove_all_from_favorites_1.default };
//# sourceMappingURL=index.js.map