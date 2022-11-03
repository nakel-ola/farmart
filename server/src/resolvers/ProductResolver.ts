import mongoose from "mongoose";
import xss from "xss";
import clean from "../helper/clean";
import ImageUplaod from "../helper/ImageUpload";
import authenticated from "../middleware/authenticated";
import db from "../models";
import type { ReqBody } from "../typing";
import type { Msg } from "../typing/custom";
import type {
  CreateProductArgs,
  CreateReviewArgs,
  DeleteReviewArgs,
  ModifyProductArgs,
  ProductDataType,
  ProductsArgs,
  ProductSearchArgs,
  ProductSearchType,
  ProductsSummaryType,
  ProductType,
  ReviewType,
} from "../typing/product";

const products = async (
  args: ProductsArgs,
  req: ReqBody
): Promise<ProductDataType> => {
  try {
    let genre = args.input.genre ? xss(args.input.genre) : null,
      offset = Number(xss(args.input.offset.toString() ?? "0")),
      limit = Number(xss(args.input.limit.toString() ?? "10")) + offset,
      outOfStock = args.input?.outOfStock;

    let filter = clean({
      stock: outOfStock ? 0 : null,
      category: genre ?? null,
    });
    let data: ProductType[] = await db.productSchema.find(filter);

    let newData = {
      genre,
      totalItems: data.length,
      results: data.slice(offset, limit),
    };
    return newData;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

const product = async (args: { slug: string }): Promise<ProductType> => {
  try {
    let slug = xss(args.slug);
    const data = (await db.productSchema.findOne({ slug })) as ProductType;
    return data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

const productById = async (args: { id: string }): Promise<ProductType> => {
  try {
    let id = xss(args.id);
    const data = (await db.productSchema.findOne({ _id: id })) as ProductType;
    return data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

const productSearch = async (
  args: ProductSearchArgs
): Promise<ProductSearchType> => {
  try {
    let search = xss(args.input.search),
      price = args.input.price
        ? args.input.price?.map((value) => Number(xss(value.toString())))
        : [0, Infinity],
      discount = args.input.discount
        ? args.input.discount.map((value) => xss(value))
        : null,
      category = args.input.category
        ? args.input.category.map((value) => xss(value))
        : null,
      rating = args.input.rating
        ? Number(xss(args.input.rating.toString()))
        : 0,
      offset = Number(xss(args.input.offset.toString() ?? "0")),
      limit = Number(xss(args.input.limit.toString() ?? "10")) + offset,
      outOfStock = args.input?.outOfStock;

    let filter = clean({
      price: { $lte: price[1], $gte: price[0] },
      rating: { $gte: rating },
      discount: discount ? { $in: discount } : null,
      category: category ? { $in: category } : null,
      stock: outOfStock ? 0 : null,
      $or: [
        { title: new RegExp(search, "i") },
        { category: new RegExp(search, "i") },
      ],
    });

    const data = (await db.productSchema.find(filter)) as ProductType[];

    let newData = {
      search,
      totalItems: data.length,
      results: data.slice(offset, limit),
    };

    return newData;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

const categories = async (): Promise<{ name: string }[]> => {
  try {
    const data = await db.categorySchema.find();
    return data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

const createCategories = authenticated(
  async (args: { categories: string[] }, req: ReqBody): Promise<Msg> => {
    try {
      let admin = req.admin,
        categories = args.categories.map((category) => ({
          name: xss(category),
        }));

      if (!admin) {
        throw new Error("You don't have permission to create categories");
      }

      await db.categorySchema.insertMany(categories);

      return { msg: "Categories added successfully" };
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  }
);

const deleteCategories = authenticated(
  async (args: { categories: string[] }, req: ReqBody): Promise<Msg> => {
    try {
      let admin = req.admin,
        categories = args.categories.map((category) => ({
          name: xss(category),
        }));

      if (!admin) {
        throw new Error("You don't have permission to delete categories");
      }

      for (let i = 0; i < categories.length; i++) {
        const element = categories[i];
        await db.categorySchema.deleteOne({ name: element.name });
      }

      return { msg: "Categories deleted successfully" };
    } catch (e) {
      console.error(e);
      throw new Error(e.message);
    }
  }
);

const createReview = authenticated(
  async (args: CreateReviewArgs, req: ReqBody): Promise<Msg> => {
    try {
      let userId = req.userId,
        input = args.input,
        name = xss(input.name),
        productId = xss(input.productId),
        photoUrl = xss(input.photoUrl),
        message = xss(input.message);

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("ID must be a valid");
      }

      const newReview = {
        name,
        userId,
        photoUrl,
        message,
      };

      await db.productSchema.updateOne(
        { _id: productId },
        { $push: { reviews: newReview } }
      );

      return { msg: "Successfully added review" };
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }
);

const deleteReview = authenticated(
  async (args: DeleteReviewArgs, req: ReqBody): Promise<Msg> => {
    try {
      let admin = req.admin,
        userId = req.userId,
        productId = args.input.productId,
        reviewId = args.input.reviewId;

      if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new Error("Review ID must be a valid");
      }

      if (admin) {
        await db.productSchema.updateOne(
          { _id: productId },
          { $pull: { reviews: { _id: reviewId } } }
        );
      } else {
        await db.productSchema.updateOne(
          { _id: productId },
          { $pull: { reviews: { _id: reviewId, userId } } }
        );
      }

      return { msg: "Successfully deleted review" };
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }
);

const reviews = authenticated(
  async (args: { productId: string }): Promise<ReviewType[]> => {
    try {
      let productId = xss(args.productId);

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Porduct ID must be a valid");
      }

      const data = (await db.productSchema.findOne(
        { _id: productId },
        { reviews: 1 }
      )) as { reviews: ReviewType[] };

      return data.reviews ?? [];
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

const createProduct = authenticated(
  async (args: CreateProductArgs, req: ReqBody): Promise<Msg> => {
    try {
      let admin = req.admin,
        input = args.input,
        title = xss(input.title),
        slug = xss(input.slug),
        category = xss(input.category),
        description = xss(input.description),
        image = input.image,
        price = Number(xss(`${input.price}`)),
        stock = Number(xss(`${input.stock}`)),
        rating = 0,
        currency = {
          name: xss(input.currency.name),
          symbol: xss(input.currency.symbol),
          symbolNative: xss(input.currency.symbolNative),
          decimalDigits: xss(`${input.currency.decimalDigits}`),
          rounding: xss(`${input.currency.rounding}`),
          code: xss(input.currency.code),
          namePlural: xss(input.currency.namePlural),
        },
        reviews = [];

      if (!admin) {
        throw new Error("You don't have permission to create products");
      }

      const newImage = await ImageUplaod(image.file);

      const data = {
        title,
        slug,
        category,
        description,
        image: newImage,
        price,
        stock,
        rating,
        currency,
        reviews,
      };
      const newData = await db.productSchema.create(data);
      if (newData) {
        return { msg: "Created successfully" };
      }
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

const modifyProduct = authenticated(
  async (args: ModifyProductArgs, req: ReqBody): Promise<Msg> => {
    try {
      let admin = req.admin,
        input = args.input,
        id = xss(input.id),
        title = xss(input.title),
        slug = xss(input.slug),
        category = xss(input.category),
        description = xss(input.description),
        image = input?.image
          ? {
              name: xss(input?.image?.name),
              url: xss(input?.image?.url),
            }
          : null,
        imageUpload = input.imageUpload,
        price = Number(xss(`${input.price}`)),
        stock = Number(xss(`${input.stock}`)),
        currency = {
          name: xss(input.currency.name),
          symbol: xss(input.currency.symbol),
          symbolNative: xss(input.currency.symbolNative),
          decimalDigits: xss(`${input.currency.decimalDigits}`),
          rounding: xss(`${input.currency.rounding}`),
          code: xss(input.currency.code),
          namePlural: xss(input.currency.namePlural),
        };

      if (!admin) {
        throw new Error("Something went wrong");
      }

      const newImage = image ?? (await ImageUplaod(imageUpload.file));

      const user = await db.productSchema.updateOne(
        { _id: id },
        {
          title,
          slug,
          category,
          description,
          image: newImage,
          price,
          stock,
          currency,
        }
      );

      console.log(user);

      if (!user) {
        throw new Error("Something went wrong");
      }
      return { msg: "Successfully updated" };
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

const deleteProduct = authenticated(
  async (args: { id: string }, req: ReqBody): Promise<Msg> => {
    try {
      let admin = req.admin,
        id = xss(args.id);

      if (!admin) {
        throw new Error("Something went wrong");
      }

      const data = await db.productSchema.deleteOne({ _id: id });

      if (data) {
        return { msg: "Deleted Successfully" };
      }
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

const productsSummary = authenticated(
  async (_, req: ReqBody): Promise<ProductsSummaryType> => {
    try {
      const admin = req.admin;

      if (!admin) {
        throw new Error("You don,t have permission");
      }
      const products = await db.productSchema.find();
      const orders = await db.orderSchema.find();

      let totalDelivered: number = 0;

      for (let i = 0; i < orders.length; i++) {
        let element = orders[i].progress;

        let checked = element.find(
          (r) => r.name.toLowerCase() === "delivered" && r.checked
        );
        if (checked) {
          totalDelivered += 1;
        }
      }

      const data = {
        __typename: "ProductSummary",
        totalOrders: orders.length,
        totalDelivered,
        totalStock: products.reduce((amount, item) => amount + item.stock, 0),
        outOfStock: products.filter((product) => product.stock === 0).length,
      };

      return data;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

export default {
  products,
  product,
  productSearch,
  categories,
  createReview,
  reviews,
  productById,
  createProduct,
  modifyProduct,
  deleteProduct,
  productsSummary,
  createCategories,
  deleteCategories,
  deleteReview,
};
