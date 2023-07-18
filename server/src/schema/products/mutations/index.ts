import createCategories from "./create_categories";
import createProduct from "./create_product";
import createReview from "./create_review";
import deleteReview from "./delete_review";
import deleteCategories from "./delete_categories";
import deleteProduct from "./delete_product";
import updateProduct from "./update_product";

const mutation = {
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  deleteReview,
  createCategories,
  deleteCategories
};

export default mutation;
