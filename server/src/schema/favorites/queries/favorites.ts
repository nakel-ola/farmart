import type { ProductType, ResolverFn } from "../../../../typing";
import redisGet from "../../../utils/redisGet";
import redisKeys from "../../../utils/redisKeys";

interface Args {
  input: {
    offset: number;
    limit: number;
  };
}

interface ReturnValue {
  totalItems: number;
  results: ProductType[];
}
const favorites: ResolverFn<Args, ReturnValue> = async (_, args, ctx) => {
  try {
    const { limit, offset } = args.input;
    const { db, user, productLoader } = ctx;
    const userId = user?.id.toString();

    const key = `favorites:${userId}?limit=${limit}&offset=${offset}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    await redisKeys("favorites-keys", key);

    const favorites = await db.favorites.findOne({ where: { userId } });

    if (!favorites) return { totalItems: 0, results: [] };

    const products = (await productLoader.loadMany(
      favorites.data
    )) as ProductType[];


    const results = favorites.data
      .map((f) => {
        const product = products.find((p) => p.id?.toString() === f);
        return {
          ...product,
          id: product?.id.toString(),
          favorite: true,
        };
      })
      .filter((f) => f !== undefined)
      .slice(offset, limit) as (ProductType & { favorite: boolean })[];

    const data = {
      totalItems: favorites.data.length,
      results,
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
