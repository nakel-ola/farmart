"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const EmployeeUnion_1 = __importDefault(require("./EmployeeUnion"));
const OrdersUnion_1 = __importDefault(require("./OrdersUnion"));
const typeResolver = {};
exports.default = (0, lodash_1.merge)(typeResolver, OrdersUnion_1.default, EmployeeUnion_1.default);
