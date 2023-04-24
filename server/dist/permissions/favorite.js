"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteMutation = exports.favoriteQuery = void 0;
const graphql_shield_1 = require("graphql-shield");
const user_1 = require("./user");
const favoriteInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    id: yup.string().required(),
}));
const favoritesInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup.object({
        offset: yup.number().integer().nullable(),
        limit: yup.number().integer().nullable(),
    }),
}));
const favoriteQuery = {
    favorites: (0, graphql_shield_1.and)(favoritesInput, user_1.isAuthenticated),
    favorite: (0, graphql_shield_1.and)(favoriteInput, user_1.isAuthenticated),
};
exports.favoriteQuery = favoriteQuery;
const favoriteMutation = {
    addToFavorites: (0, graphql_shield_1.and)(favoriteInput, user_1.isAuthenticated),
    removeFromFavorites: (0, graphql_shield_1.and)(favoriteInput, user_1.isAuthenticated),
    removeAllFromFavorites: user_1.isAuthenticated,
};
exports.favoriteMutation = favoriteMutation;
//# sourceMappingURL=favorite.js.map