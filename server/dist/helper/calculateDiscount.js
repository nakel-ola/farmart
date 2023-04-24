"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculateDiscount = (price, discount) => {
    const discountPrice = price * (discount / 100);
    const total = price - discountPrice;
    return total.toFixed(2);
};
exports.default = calculateDiscount;
//# sourceMappingURL=calculateDiscount.js.map