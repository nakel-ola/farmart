import type { ProductType, ResolverFn } from "../../../../typing";
import clean from "../../../helper/clean";
import clear_id from "../../../helper/clear_id";
import redisGet from "../../../helper/redisGet";

interface Args {
  input: {
    outOfStock: boolean;
    genre: string;
    offset: number;
    limit: number;
  };
}

interface ReturnValue {
  genre: string;
  totalItems: number;
  results: ProductType[];
}
const products: ResolverFn<Args, Promise<ReturnValue>> = async (
  _,
  args,
  ctx
) => {
  try {
    const { genre, limit, offset, outOfStock } = args.input;
    const { db, req, user } = ctx;

    if (outOfStock && !req.admin)
      throw new Error("You dont have admin permission");

    const userId = user ? user?._id?.toString() : null;

    const key = `products${userId ? `:${userId}` : ""}${
      genre ? `:${genre}` : ""
    }?offset=${offset}&limit=${limit}${
      outOfStock ? "&outOfStock=${outOfStock}" : ""
    }`;

    // getting cache data from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    let filter = clean({ stock: outOfStock ? 0 : null, category: genre });

    let data = await db.products.find(filter, null, { limit, skip: offset });

    const favorites = user ? await db.favorites.findOne({ userId }) : null;

    const getFavorite = (id: string) => !!favorites?.data.find((f) => f === id);

    const results = data.map((d) => ({
      ...d.toJSON(),
      favorite: favorites ? getFavorite(d._id.toString()) : false,
    }));

    let totalItems = await db.products.count(filter);

    let newData = {
      genre: genre,
      totalItems,
      results: clear_id(results),
    };

    // cache products to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(newData));
    return newData;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default products;
