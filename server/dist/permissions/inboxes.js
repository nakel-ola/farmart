"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inboxesQuery = exports.inboxesMutation = void 0;
const graphql_shield_1 = require("graphql-shield");
const user_1 = require("./user");
const inboxesInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup.object({
        page: yup.number().integer().nullable(),
        limit: yup.number().integer().nullable(),
        customerId: yup.string().nullable(),
    }),
}));
const createInboxInput = (0, graphql_shield_1.inputRule)()((yup) => yup
    .object({
    input: yup
        .object({
        title: yup.string().required(),
        description: yup.string().required(),
        userId: yup.string().required(),
    })
        .required(),
})
    .required());
const updateInboxInput = (0, graphql_shield_1.inputRule)()((yup) => yup
    .object({
    input: yup
        .object({
        title: yup.string().required(),
        description: yup.string().required(),
        userId: yup.string().required(),
        id: yup.string().required(),
    })
        .required(),
})
    .required());
const inboxesQuery = {
    inboxes: (0, graphql_shield_1.and)(inboxesInput, user_1.isAuthenticated),
};
exports.inboxesQuery = inboxesQuery;
const inboxesMutation = {
    createInbox: (0, graphql_shield_1.and)(user_1.isDashboard, createInboxInput, user_1.isAuthenticated, user_1.isAdmin, user_1.isEditor),
    updateInbox: (0, graphql_shield_1.and)(user_1.isDashboard, updateInboxInput, user_1.isAuthenticated, user_1.isAdmin, user_1.isEditor),
};
exports.inboxesMutation = inboxesMutation;
