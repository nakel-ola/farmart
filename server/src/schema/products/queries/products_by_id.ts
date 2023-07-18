import { ProductType, ResolverFn } from "../../../../typing";
import redisGet from "../../../utils/redisGet";

interface Args {
  ids: string[];
}
const productsById: ResolverFn<Args> = async (_, args, ctx) => {
  try {
    const { redis, productLoader, user } = ctx;

    const key = `product${
      user ? `:${user.id?.toString()}` : ""
    }:${args.ids.join(",")}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<ProductType[]>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // find product from db
    const data = (await productLoader.loadMany(args.ids)) as ProductType[];

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
