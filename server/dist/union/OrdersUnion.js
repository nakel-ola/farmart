"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OrdersUnion = (value) => {
    switch (value.type) {
        case "OrderData":
            return "OrderData";
        case "Order":
            return "Order";
        default:
            break;
    }
};
exports.default = { OrdersUnion };
