import type { Product, ProductType, ResolverFn } from "../../../../typing";
import clear_id from "../../../helper/clear_id";
import redisGet from "../../../helper/redisGet";
import redisKeys from "../../../helper/redisKeys";

interface Args {
  input: {
    offset: number;
    limit: number;
  };
}

interface ReturnValue {
  totalItems: number;
  results: Product[];
}
const favorites: ResolverFn<Args, Promise<ReturnValue>> = async (
  _,
  args,
  ctx
) => {
  try {
    const { limit, offset } = args.input;
    const { db, user, productLoader } = ctx;
    const userId = user?._id.toString();

    const key = `favorites:${userId}?limit=${limit}&offset=${offset}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    await redisKeys("favorites-keys", key);

    const favorites = await db.favorites.findOne({ userId });

    if (!favorites) return { totalItems: 0, results: [] };

    const products = (await productLoader.loadMany(
      favorites.data
    )) as Product[];

    const results = favorites.data
      .map((f) => ({
        ...products.find((p) => p._id.toString() === f)?.toJSON(),
        favorite: true,
      }))
      .filter((f) => f !== undefined)
      .slice(offset, limit) as (Product & { favorite: boolean })[];

    const data = {
      totalItems: favorites.data.length,
      results: clear_id(results),
    };

    // cache data to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(data));
    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default favorites;
