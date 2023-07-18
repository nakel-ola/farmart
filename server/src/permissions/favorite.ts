import { and, inputRule } from "graphql-shield";
import { isAuthenticated } from "./user";

const favoriteInput = inputRule()((yup) =>
  yup.object({
    id: yup.string().required(),
  })
);
const favoritesInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      offset: yup.number().integer().nullable(),
      limit: yup.number().integer().nullable(),
    }),
  })
);

const queries = {
  favorites: and(favoritesInput, isAuthenticated),
  favorite: and(favoriteInput, isAuthenticated),
};
const mutations = {
  addToFavorites: and(favoriteInput, isAuthenticated),
  removeFromFavorites: and(favoriteInput, isAuthenticated),
  removeAllFromFavorites: isAuthenticated,
};

export default { queries, mutations };
