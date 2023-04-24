"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersQuery = exports.ordersMutation = void 0;
const graphql_shield_1 = require("graphql-shield");
const user_1 = require("./user");
const ordersInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup.object({
        page: yup.number().integer().nullable(),
        limit: yup.number().integer().nullable(),
        customerId: yup.string().nullable(),
        status: yup.string().nullable(),
    }),
}));
const orderInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    id: yup.string().required(),
}));
const filterByIdInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup.object({
        page: yup.number().integer().nullable(),
        limit: yup.number().integer().nullable(),
        orderId: yup.string().required(),
    }),
}));
const filterByStatusInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup.object({
        page: yup.number().integer().nullable(),
        limit: yup.number().integer().nullable(),
        status: yup.string().required(),
    }),
}));
const createOrderInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup.object({
        totalPrice: yup.string().required(),
        address: yup.object({
            id: yup.string().required(),
            userId: yup.string().required(),
            name: yup.string().required(),
            street: yup.string().required(),
            city: yup.string().required(),
            state: yup.string().required(),
            country: yup.string().required(),
            default: yup.boolean().required(),
            info: yup.string().nullable(),
            phoneNumber: yup.string().required(),
            phoneNumber2: yup.string().nullable(),
        }),
        pickup: yup.string().nullable(),
        coupon: yup
            .object({
            id: yup.string().required(),
            email: yup.string().required(),
            discount: yup.string().required(),
            code: yup.string().required(),
            userId: yup.string().required(),
            description: yup.string().nullable(),
            expiresIn: yup.string().nullable(),
            createdAt: yup.date().nullable(),
            updatedAt: yup.date().nullable(),
        })
            .nullable(),
        paymentMethod: yup.string().required(),
        shippingFee: yup.string().nullable(),
        phoneNumber: yup.string().nullable(),
        deliveryMethod: yup.string().required(),
        products: yup.array().of(yup.object({
            id: yup.string().required(),
            price: yup.string().required(),
            quantity: yup.number().integer().required(),
        })),
        paymentId: yup.string().required(),
    }),
}));
const updateProgress = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup
        .object({
        id: yup.string().required(),
        name: yup.string().required(),
    })
        .required(),
}));
const ordersQuery = {
    orders: (0, graphql_shield_1.and)(ordersInput, user_1.isAuthenticated),
    order: (0, graphql_shield_1.and)(orderInput, user_1.isAuthenticated),
    filterById: (0, graphql_shield_1.and)(filterByIdInput, user_1.isAuthenticated),
    filterByStatus: (0, graphql_shield_1.and)(filterByStatusInput, user_1.isAuthenticated),
    ordersSummary: (0, graphql_shield_1.and)(user_1.isDashboard, user_1.isAuthenticated, user_1.isAdmin),
    ordersStatistics: (0, graphql_shield_1.and)(user_1.isDashboard, user_1.isAuthenticated, user_1.isAdmin),
};
exports.ordersQuery = ordersQuery;
const ordersMutation = {
    createOrder: (0, graphql_shield_1.and)(createOrderInput, user_1.isAuthenticated),
    updateProgress: (0, graphql_shield_1.and)(updateProgress, user_1.isAuthenticated),
};
exports.ordersMutation = ordersMutation;
//# sourceMappingURL=orders.js.map