"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dataloader_1 = __importDefault(require("dataloader"));
const context_1 = require("../context");
const productLoader = new dataloader_1.default((keys) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield context_1.db.products.find({ _id: { $in: keys } });
    return keys
        .map((key) => { var _a; return (_a = results.find((r) => r.id === key)) !== null && _a !== void 0 ? _a : false; })
        .filter(Boolean);
}));
exports.default = productLoader;
//# sourceMappingURL=productLoader.js.map