"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const filter_by_id_1 = __importDefault(require("./filter-by-id"));
const filter_by_status_1 = __importDefault(require("./filter-by-status"));
const order_1 = __importDefault(require("./order"));
const orders_1 = __importDefault(require("./orders"));
const orders_statistics_1 = __importDefault(require("./orders-statistics"));
const orders_summary_1 = __importDefault(require("./orders-summary"));
exports.default = {
    filterById: filter_by_id_1.default,
    filterByStatus: filter_by_status_1.default,
    order: order_1.default,
    orders: orders_1.default,
    ordersStatistics: orders_statistics_1.default,
    ordersSummary: orders_summary_1.default,
};
