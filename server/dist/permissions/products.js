"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsQuery = exports.productsMutation = void 0;
const graphql_shield_1 = require("graphql-shield");
const user_1 = require("./user");
const productsInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    outOfStock: yup.boolean().nullable().default(false),
    genre: yup.string().nullable().default(""),
    offset: yup.number().integer().nullable().default(0),
    limit: yup.number().integer().nullable().default(10),
}));
const productInput = (0, graphql_shield_1.inputRule)()((yup) => yup
    .object({
    slug: yup.string().required(),
})
    .required());
const productsByIdInput = (0, graphql_shield_1.inputRule)()((yup) => yup
    .object({
    ids: yup.array().of(yup.string().required()).required(),
})
    .required());
const productSearchInput = (0, graphql_shield_1.inputRule)()((yup) => yup
    .object({
    input: yup.object({
        search: yup.string().required(),
        outOfStock: yup.boolean().nullable(),
        category: yup.array().of(yup.string().required()).nullable(),
        price: yup.array().of(yup.number().required()).nullable(),
        discount: yup.array().of(yup.string().required()).nullable(),
        rating: yup.number().nullable(),
        offset: yup.number().nullable(),
        limit: yup.number().nullable(),
    }),
})
    .required());
const reviewInput = (0, graphql_shield_1.inputRule)()((yup) => yup
    .object({
    productId: yup.string().required(),
})
    .required());
const createReviewInput = (0, graphql_shield_1.inputRule)()((yup) => yup
    .object({
    input: yup.object({
        productId: yup.string().required(),
        name: yup.string().required(),
        title: yup.string().required(),
        rating: yup.number().oneOf([1, 2, 3, 4, 5]).required(),
        message: yup.string().required(),
    }),
})
    .required());
const deleteReviewInput = (0, graphql_shield_1.inputRule)()((yup) => yup
    .object({
    input: yup.object({
        productId: yup.string().required(),
        reviewId: yup.string().required(),
    }),
})
    .required());
const createProductInput = (0, graphql_shield_1.inputRule)()((yup) => yup
    .object({
    input: yup.object({
        title: yup.string().required(),
        slug: yup.string().required(),
        category: yup.string().required(),
        description: yup.string().required(),
        image: yup.string().required(),
        price: yup.number().required(),
        stock: yup.number().integer().required(),
        discount: yup.string().nullable(),
    }),
})
    .required());
const updateProductInput = (0, graphql_shield_1.inputRule)()((yup) => yup
    .object({
    input: yup.object({
        id: yup.string().required(),
        title: yup.string().required(),
        slug: yup.string().required(),
        category: yup.string().required(),
        description: yup.string().required(),
        image: yup.string().required(),
        price: yup.string().required(),
        stock: yup.string().required(),
        currency: yup
            .object({
            name: yup.string().nullable(),
            symbol: yup.string().nullable(),
            symbolNative: yup.string().nullable(),
            decimalDigits: yup.number().nullable(),
            rounding: yup.number().nullable(),
            code: yup.string().nullable(),
            namePlural: yup.string().nullable(),
        })
            .nullable(),
    }),
})
    .required());
const deleteProductInput = (0, graphql_shield_1.inputRule)()((yup) => yup
    .object({
    id: yup.string().required(),
})
    .required());
const categoriesInput = (0, graphql_shield_1.inputRule)()((yup) => yup
    .object({
    categories: yup.array().of(yup.string().required()).required(),
})
    .required());
const productsQuery = {
    categories: graphql_shield_1.allow,
    products: productsInput,
    product: productInput,
    productsById: productsByIdInput,
    productSearch: productSearchInput,
    reviews: reviewInput,
    productsSummary: (0, graphql_shield_1.and)(user_1.isDashboard, user_1.isAuthenticated, user_1.isAdmin),
};
exports.productsQuery = productsQuery;
const productsMutation = {
    createReview: (0, graphql_shield_1.and)(createReviewInput, user_1.isAuthenticated),
    deleteReview: (0, graphql_shield_1.and)(deleteReviewInput, user_1.isAuthenticated),
    createProduct: (0, graphql_shield_1.and)(user_1.isDashboard, createProductInput, user_1.isAuthenticated, user_1.isAdmin, user_1.isEditor),
    updateProduct: (0, graphql_shield_1.and)(user_1.isDashboard, updateProductInput, user_1.isAuthenticated, user_1.isAdmin, user_1.isEditor),
    deleteProduct: (0, graphql_shield_1.and)(user_1.isDashboard, deleteProductInput, user_1.isAuthenticated, user_1.isAdmin, user_1.isEditor),
    createCategories: (0, graphql_shield_1.and)(user_1.isDashboard, categoriesInput, user_1.isAuthenticated, user_1.isAdmin, user_1.isEditor),
    deleteCategories: (0, graphql_shield_1.and)(user_1.isDashboard, categoriesInput, user_1.isAuthenticated, user_1.isAdmin, user_1.isEditor),
};
exports.productsMutation = productsMutation;
