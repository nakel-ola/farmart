import { CouponType, ResolverFn } from "../../../../typing";
import redisGet from "../../../utils/redisGet";


interface Args {
  customerId?: string;
}
const coupons: ResolverFn<Args, CouponType[]> = async (_, args, ctx) => {
  try {
    const { customerId } = args;
    const { db, user, redis } = ctx;

    const userId = customerId ?? user?.id?.toString()!;

    const key = `coupons:${userId}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<CouponType[]>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const filter = { userId };

    const data = (await db.coupons.find({ where: filter })).map((c) => ({
      ...c,
      id: c.id.toString(),
    }));

    // cache data to redis
    await redis.setex(key, 3600, JSON.stringify(data));

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default coupons;
