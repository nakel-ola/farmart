import xss from "xss";
import authenticated from "../middleware/authenticated";
import db from "../models";
import mongoose from "mongoose";

const favorites = authenticated(async (args, req) => {
  try {
    let userId = xss(req.userId);
    let offset = Number(xss(args.input.offset ?? 0));
    let limit = Number(xss(args.input.limit ?? 10)) + offset;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("User ID must be a valid");
    }

    const favorites = await db.favoriteSchema.findOne({ userId });
    const products = await db.productSchema.find();

    const data = {
      totalItems: favorites ? favorites.data.length : 0,
      results: favorites
        ? favorites.data
            .map((product) => {
              return products.find((p) => p._id.toString() === product);
            })
            .slice(offset, limit)
        : [],
    };

    return data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
});

const favorite = authenticated(async (args, req) => {
  try {
    let id = xss(args.id);
    let userId = xss(req.userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("User ID must be a valid");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Product ID must be a valid");
    }

    const favorite = await db.favoriteSchema.findOne({ userId });

    const data = favorite?.data?.find((p) => p === id);
    if (data === undefined) {
      throw new Error("Product not Found");
    }
    return { id: data } ?? null;
  } catch (e) {
    throw new Error(e.message);
  }
});

const addToFavorites = authenticated(async (args, req) => {
  try {
    let id = xss(args.id);
    let userId = xss(req.userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("User ID must be a valid");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Product ID must be a valid");
    }

    const user = await db.favoriteSchema.findOne({ userId });

    if (user) {
      await db.favoriteSchema.updateOne({ userId }, { $push: { data: id } });
    } else {
      await db.favoriteSchema.create({ userId, data: [id] });
    }
    return { msg: "Added" };
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
});

const removeFromFavorites = authenticated(async (args, req) => {
  try {
    let id = xss(args.id);
    let userId = xss(req.userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("User ID must be a valid");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Product ID must be a valid");
    }

    const user = await db.favoriteSchema.findOne({ userId });

    if (!user) {
      throw new Error("Who the fuck are u ???");
    } else {
      await db.favoriteSchema.updateOne({ userId }, { $pull: { data: id } });
      return { msg: "Removed" };
    }
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
});

const removeAllFromFavorites = authenticated(async (args, req) => {
  try {
    let userId = xss(req.userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("User ID must be a valid");
    }

    const user = await db.favoriteSchema.updateOne({ userId }, { data: [] });
    console.log(user);

    return { msg: "Removed" };
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
});

const FavoriteResolver = {
  favorite,
  favorites,
  addToFavorites,
  removeFromFavorites,
  removeAllFromFavorites,
};
export default FavoriteResolver;
