import { ResolverFn } from "../../../../typing";
import redisGet from "../../../utils/redisGet";

type ReturnValue = { name: string }[];

const categories: ResolverFn<null, ReturnValue> = async (_, args, ctx) => {
  try {
    const key = "categories";

    // getting cache data from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // if no cache
    const data = (await ctx.db.categories.find({})).map((d) => ({
      ...d,
      id: d.id.toString(),
    }));

    // cache data to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(data));

    return data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};
export default categories;
