"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponsMutation = exports.couponsQuery = void 0;
const graphql_shield_1 = require("graphql-shield");
const user_1 = require("./user");
const deleteCouponInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup.object({
        id: yup.string().required(),
        userId: yup.string().required(),
    }),
}));
const createCouponInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup.object({
        email: yup.string().required(),
        discount: yup.string().required(),
        description: yup.string().nullable(),
        userId: yup.string().required(),
        expiresIn: yup.string().nullable(),
    }),
}));
const verifyCouponInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup.object({
        email: yup.string().email().required(),
        coupon: yup.string().required(),
    }),
}));
const couponInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    customerId: yup.string().nullable(),
}));
const couponsQuery = {
    verifyCoupon: (0, graphql_shield_1.and)(verifyCouponInput, user_1.isAuthenticated),
    coupons: (0, graphql_shield_1.and)(couponInput, user_1.isAuthenticated),
};
exports.couponsQuery = couponsQuery;
const couponsMutation = {
    deleteCoupon: (0, graphql_shield_1.and)(user_1.isDashboard, deleteCouponInput, user_1.isAuthenticated, user_1.isAdmin, user_1.isEditor),
    createCoupon: (0, graphql_shield_1.and)(user_1.isDashboard, createCouponInput, user_1.isAuthenticated, user_1.isAdmin, user_1.isEditor),
};
exports.couponsMutation = couponsMutation;
//# sourceMappingURL=coupons.js.map