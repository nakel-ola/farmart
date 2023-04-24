"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressQuery = exports.addressMutation = void 0;
const graphql_shield_1 = require("graphql-shield");
const user_1 = require("./user");
const addressInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    id: yup.string().required(),
}));
const createAddressInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup.object({
        name: yup.string().required(),
        street: yup.string().required(),
        city: yup.string().required(),
        state: yup.string().required(),
        country: yup.string().required(),
        info: yup.string().nullable(),
        phoneNumber: yup.string().required(),
        phoneNumber2: yup.string().nullable(),
    }),
}));
const updateAddressInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup.object({
        id: yup.string().required(),
        userId: yup.string().required(),
        name: yup.string().required(),
        street: yup.string().required(),
        city: yup.string().required(),
        state: yup.string().required(),
        country: yup.string().required(),
        info: yup.string().nullable(),
        phoneNumber: yup.string().required(),
        phoneNumber2: yup.string().nullable(),
        default: yup.boolean().nullable()
    }),
}));
const deleteAddressInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    id: yup.string().required(),
}));
const addressQuery = {
    addresses: (0, graphql_shield_1.and)(user_1.isAuthenticated),
    address: (0, graphql_shield_1.and)(addressInput, user_1.isAuthenticated),
};
exports.addressQuery = addressQuery;
const addressMutation = {
    createAddress: (0, graphql_shield_1.and)(createAddressInput, user_1.isAuthenticated),
    updateAddress: (0, graphql_shield_1.and)(updateAddressInput, user_1.isAuthenticated),
    deleteAddress: (0, graphql_shield_1.and)(deleteAddressInput, user_1.isAuthenticated),
};
exports.addressMutation = addressMutation;
//# sourceMappingURL=address.js.map