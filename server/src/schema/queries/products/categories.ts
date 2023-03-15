import type { ResolverFn } from "../../../../typing";
import clear_id from "../../../helper/clear_id";
import redisGet from "../../../helper/redisGet";

type ReturnValue = { name: string }[];
const categories: ResolverFn<any, Promise<ReturnValue>> = async (
  _,
  args,
  ctx
) => {
  try {
    const key = "categories";

    // getting cache data from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // if no cache
    const data = (await ctx.db.categories.find({})).map((d) => d.toJSON());

    // cache data to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(clear_id(data)));

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default categories;
