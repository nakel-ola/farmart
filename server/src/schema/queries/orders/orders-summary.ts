import type { ResolverFn } from "../../../../typing";
import redisGet from "../../../helper/redisGet";

interface ReturnType {
  pending: number;
  delivered: number;
  canceled: number;
}
const ordersSummary: ResolverFn<any, Promise<ReturnType>> = async (
  _,
  args,
  ctx
) => {
  try {
    const { db } = ctx;

    const key = `order-summary`;

    // getting cache data from redis if available
    const redisCache = await redisGet<ReturnType>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const orders = await db.orders.find();

    const data = {
      pending: orders.filter((order) => order.status === "pending").length,
      delivered: orders.filter((order) => order.status === "delivered").length,
      canceled: orders.filter((order) => order.status === "canceled").length,
    };

    // cache data to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(data));

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default ordersSummary;
