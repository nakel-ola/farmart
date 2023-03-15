import type { OrderType, ResolverFn } from "../../../../typing";
import formatJson from "../../../helper/formatJson";
import redisGet from "../../../helper/redisGet";

interface Args {
  id: string;
}
const order: ResolverFn<Args, Promise<OrderType>> = async (_, args, ctx) => {
  try {
    const { db, req, user } = ctx;

    const userId = user?._id.toString();

    const key = `order:${userId}:${args.id}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<OrderType>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const filter = req.admin ? { _id: args.id } : { _id: args.id, userId };

    const data = await db.orders.findOne(filter);

    if (!data) throw new Error("Something went wrong");

    const newData = formatJson(data) 

    // cache data to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(newData));

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default order;
