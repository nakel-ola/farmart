import type { ResolverFn } from "../../../../typing";
import redisGet from "../../../helper/redisGet";

interface ReturnValue {
  min: number;
  max: number;
  week: number[];
  month: number[];
}

const ordersStatistics: ResolverFn<any, Promise<ReturnValue>> = async (
  _,
  args,
  ctx
) => {
  try {
    const { db } = ctx;

    const key = `orders-statistics`;

    // getting cache data from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const orders = await db.orders.find(
      {},
      { totalPrice: 1, progress: 1, createdAt: 1, updatedAt: 1 }
    );

    let totals =
      orders.length > 0 ? orders.map((order) => Number(order.totalPrice)) : [];

    const data = {
      min: 0,
      max: 136 ?? Math.round(Math.max(...totals)),
      week: [0, 86, 28, 115, 48, 210, 136],
      month: [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35],
    };

    // cache data to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(data));

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default ordersStatistics;
