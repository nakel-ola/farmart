import { ObjectId } from "mongodb";
import type { OrderType, ResolverFn } from "../../../../typing";
import redisGet from "../../../utils/redisGet";

interface Args {
  id: string;
}
const order: ResolverFn<Args, OrderType> = async (_, args, ctx) => {
  try {
    const { db, req, user, isAdmin } = ctx;

    const userId = user?.id.toString();

    const key = `order:${userId}:${args.id}`;

    // getting cache data from redis if available
    // const redisCache = await redisGet<OrderType>(key);

    // if redis cache is available
    // if (redisCache) return redisCache;

    const filter = isAdmin
      ? { _id: new ObjectId(args.id) }
      : { _id: new ObjectId(args.id), userId };

    const data = await db.orders.findOne({ where: filter });

    if (!data) throw new Error("Something went wrong");

    const newData = {
      ...data,
      id: data.id.toString(),
      address: { ...data.address, id: data.address.id.toString() },
    };

    // cache data to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(newData));

    return newData;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default order;
