"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categories_1 = __importDefault(require("./categories"));
const product_1 = __importDefault(require("./product"));
const product_search_1 = __importDefault(require("./product-search"));
const productsById_1 = __importDefault(require("./productsById"));
const products_1 = __importDefault(require("./products"));
const products_summary_1 = __importDefault(require("./products-summary"));
const reviews_1 = __importDefault(require("./reviews"));
exports.default = {
    categories: categories_1.default,
    products: products_1.default,
    product: product_1.default,
    productsById: productsById_1.default,
    productSearch: product_search_1.default,
    productsSummary: products_summary_1.default,
    reviews: reviews_1.default,
};
