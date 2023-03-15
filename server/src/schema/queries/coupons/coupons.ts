import type { CouponType, ResolverFn } from "../../../../typing";
import formatJson from "../../../helper/formatJson";
import redisGet from "../../../helper/redisGet";
import toJson from "../../../helper/toJson";

interface Args {
  customerId?: string;
}
const coupons: ResolverFn<Args, Promise<CouponType[]>> = async (
  _,
  args,
  ctx
) => {
  try {
    const { customerId } = args;
    const { db, user, redis } = ctx;

    const userId = customerId ?? user?._id?.toString()!;

    const key = `coupons:${userId}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<CouponType[]>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const filter = { userId };

    const data = formatJson<CouponType[]>(await db.coupons.find(filter));

    // cache data to redis
    await redis.setex(key, 3600, JSON.stringify(data));

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default coupons;
