import { BannerType, ResolverFn } from "../../../../typing";
import redisGet from "../../../utils/redisGet";

const banners: ResolverFn<any, BannerType[]> = async (_, args, ctx) => {
  try {
    const key = "banners";

    // getting cache data from redis if available
    const redisCache = await redisGet<BannerType[]>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const data = (await ctx.db.banners.find({})).map((b) => ({
      ...b,
      id: b.id.toString(),
    }));

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
