import type { Product, ResolverFn } from "../../../../typing";
import clear_id from "../../../helper/clear_id";
import formatJson from "../../../helper/formatJson";
import redisGet from "../../../helper/redisGet";

interface Args {
  ids: string[];
}
const productsById: ResolverFn<Args> = async (_, args, ctx) => {
  try {
    const { redis, productLoader, user } = ctx;

    const key = `product${
      user ? `:${user._id?.toString()}` : ""
    }:${args.ids.join(",")}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<Product[]>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // find product from db
    const data = formatJson<Product[]>(
      (await productLoader.loadMany(args.ids)) as Product[]
    );

    if (!data) throw new Error(`Something went wrong`);

    // cache product to redis
    await redis.setex(key, 3600, JSON.stringify(data));

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default productsById;
