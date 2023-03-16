"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_categories_1 = __importDefault(require("./create-categories"));
const create_product_1 = __importDefault(require("./create-product"));
const create_review_1 = __importDefault(require("./create-review"));
const delete_categories_1 = __importDefault(require("./delete-categories"));
const delete_product_1 = __importDefault(require("./delete-product"));
const delete_review_1 = __importDefault(require("./delete-review"));
const update_product_1 = __importDefault(require("./update-product"));
exports.default = {
    createCategories: create_categories_1.default,
    createProduct: create_product_1.default,
    createReview: create_review_1.default,
    deleteProduct: delete_product_1.default,
    deleteReview: delete_review_1.default,
    deleteCategories: delete_categories_1.default,
    updateProduct: update_product_1.default,
};
