import type { OrderType, ResolverFn } from "../../../../typing";
import redisGet from "../../../utils/redisGet";

interface Args {
  input: {
    page: number;
    limit: number;
    orderId: string;
  };
}

interface ReturnValue {
  status: string;
  page: number;
  totalItems: number;
  results: OrderType;
}
const filterById: ResolverFn<Args> = async (_, args, ctx) => {
  try {
    const { limit, orderId, page } = args.input;
    const { db, user,isAdmin } = ctx;

    const userId = user?.id.toString();

    const id = new RegExp(orderId, "i");

    const key = `filterById:${userId}:${orderId}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const filter = isAdmin ? { orderId: id } : { orderId: id, userId };

    const skip = (page - 1) * limit;

    const results = await db.orders.find({ where: filter, take: limit, skip });
    const totalItems = await db.orders.count(filter);

    const data = {
      status: "",
      page,
      totalItems,
      results,
    };

    // cache data to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(data));

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default filterById;
