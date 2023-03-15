import type { HydratedDocument } from "mongoose";
import type { BannerType, ResolverFn } from "../../../../typing";
import clear_id from "../../../helper/clear_id";
import formatJson from "../../../helper/formatJson";
import redisGet from "../../../helper/redisGet";

const banners: ResolverFn<any, Promise<BannerType[]>> = async (
  _,
  args,
  ctx
) => {
  try {
    const key = "banners";

    // getting cache data from redis if available
    const redisCache = await redisGet<BannerType[]>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const data = formatJson<BannerType[]>(await ctx.db.banners.find({}));

    if (!data) throw new Error(`Something went wrong`);
    // cache data to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(data));
    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default banners;
