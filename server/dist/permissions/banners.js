"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannerMutation = exports.bannerQuery = void 0;
const graphql_shield_1 = require("graphql-shield");
const user_1 = require("./user");
const createBannerInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup.object({
        image: yup.string().required(),
        title: yup.string().required(),
        description: yup.string().required(),
        link: yup.string().nullable(),
    }),
}));
const editBannerInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup.object({
        id: yup.string().required(),
        title: yup.string().required(),
        description: yup.string().required(),
        link: yup.string().nullable(),
        image: yup.string().nullable(),
    }),
}));
const deleteBannerInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({ id: yup.string().required() }));
const bannerQuery = {
    banners: graphql_shield_1.allow,
};
exports.bannerQuery = bannerQuery;
const bannerMutation = {
    createBanner: (0, graphql_shield_1.and)(user_1.isDashboard, createBannerInput, user_1.isAuthenticated, user_1.isAdmin, user_1.isEditor),
    editBanner: (0, graphql_shield_1.and)(user_1.isDashboard, editBannerInput, user_1.isAuthenticated, user_1.isAdmin, user_1.isEditor),
    deleteBanner: (0, graphql_shield_1.and)(user_1.isDashboard, deleteBannerInput, user_1.isAuthenticated, user_1.isAdmin, user_1.isEditor),
};
exports.bannerMutation = bannerMutation;
