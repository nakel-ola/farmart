import { ProductType, ResolverFn } from "../../../../typing";
import redisGet from "../../../utils/redisGet";

interface Args {
  slug: string;
}

const product: ResolverFn<Args, ProductType | null> = async (_, args, ctx) => {
  try {
    const { user, redis, db } = ctx;

    const userId = user ? user?.id?.toString() : null;

    const key = `product${userId ? `:${userId}` : ""}:${args.slug}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<ProductType>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const data = await db.products.findOne({ where: { slug: args.slug } });

    if (!data) return null;

    // finding the favorite form the product
    const favorites = user
      ? await db.favorites.findOne({
          where: { userId: user?.id.toString() },
        })
      : null;

    const isFavorite = !!favorites?.data.find((f) => f === data.id.toString());

    const results = {
      ...data,
      id: data.id.toString(),
      favorite: favorites ? isFavorite : false,
    };

    // cache product to redis
    await redis.setex(key, 3600, JSON.stringify(results));

    return results;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};
export default product;
