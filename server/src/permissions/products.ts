import { allow, and, inputRule } from "graphql-shield";
import { isAdmin, isAuthenticated, isDashboard, isEditor } from "./user";

const productsInput = inputRule()((yup) =>
  yup.object({
    outOfStock: yup.boolean().nullable().default(false),
    genre: yup.string().nullable().default(""),
    offset: yup.number().integer().nullable().default(0),
    limit: yup.number().integer().nullable().default(10),
  })
);
const productInput = inputRule()((yup) =>
  yup
    .object({
      slug: yup.string().required(),
    })
    .required()
);
const productsByIdInput = inputRule()((yup) =>
  yup
    .object({
      ids: yup.array().of(yup.string().required()).required(),
    })
    .required()
);
const productSearchInput = inputRule()((yup) =>
  yup
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
    .required()
);
const reviewInput = inputRule()((yup) =>
  yup
    .object({
      productId: yup.string().required(),
    })
    .required()
);

const createReviewInput = inputRule()((yup) =>
  yup
    .object({
      input: yup.object({
        productId: yup.string().required(),
        name: yup.string().required(),
        title: yup.string().required(),
        rating: yup.number().oneOf([1, 2, 3, 4, 5]).required(),
        message: yup.string().required(),
      }),
    })
    .required()
);

const deleteReviewInput = inputRule()((yup) =>
  yup
    .object({
      input: yup.object({
        productId: yup.string().required(),
        reviewId: yup.string().required(),
      }),
    })
    .required()
);

const createProductInput = inputRule()((yup) =>
  yup
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
    .required()
);

const updateProductInput = inputRule()((yup) =>
  yup
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
    .required()
);

const deleteProductInput = inputRule()((yup) =>
  yup
    .object({
      id: yup.string().required(),
    })
    .required()
);

const categoriesInput = inputRule()((yup) =>
  yup
    .object({
      categories: yup.array().of(yup.string().required()).required(),
    })
    .required()
);

const queries = {
  categories: allow,
  products: productsInput,
  product: productInput,
  productsById: productsByIdInput,
  productSearch: productSearchInput,
  reviews: reviewInput,
  productsSummary: and(isDashboard, isAuthenticated, isAdmin)
};

const mutations = {
  createReview: and(createReviewInput, isAuthenticated),
  deleteReview: and(deleteReviewInput, isAuthenticated),
  createProduct: and(
    isDashboard,
    createProductInput,
    isAuthenticated,
    isAdmin,
    isEditor
  ),
  updateProduct: and(
    isDashboard,
    updateProductInput,
    isAuthenticated,
    isAdmin,
    isEditor
  ),
  deleteProduct: and(
    isDashboard,
    deleteProductInput,
    isAuthenticated,
    isAdmin,
    isEditor
  ),
  createCategories: and(
    isDashboard,
    categoriesInput,
    isAuthenticated,
    isAdmin,
    isEditor
  ),
  deleteCategories: and(
    isDashboard,
    categoriesInput,
    isAuthenticated,
    isAdmin,
    isEditor
  ),
};

export default { mutations, queries };
