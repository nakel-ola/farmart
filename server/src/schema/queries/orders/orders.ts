import type { OrderType, ResolverFn } from "../../../../typing";
import formatJson from "../../../helper/formatJson";
import redisGet from "../../../helper/redisGet";

interface Args {
  input: {
    page: number;
    limit: number;
    customerId: string;
    status: string;
  };
}

interface ReturnType {
  status: string;
  page: number;
  totalItems: number;
  results: OrderType[];
}

const orders: ResolverFn<Args, Promise<ReturnType>> = async (_, args, ctx) => {
  try {
    const { req, db, user } = ctx;
    const { customerId, limit, status, page } = args.input;

    const userId = user?._id.toString();
    const skip = (page - 1) * limit;

    const key =
      `orders:${userId}:` + status ?? "" + `page=${page}&limit=${limit}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<ReturnType>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const noStatusfilter = req.admin
      ? customerId
        ? { userId: customerId }
        : {}
      : { userId };

    const statusFilter = req.admin ? { status } : { status, user };

    const filter = !status ? noStatusfilter : statusFilter;

    const results = formatJson<OrderType[]>(
      await db.orders.find(filter, null, { skip, limit })
    );
    const totalItems = await db.orders.count(filter);

    const data = { status, page, totalItems, results };

    // cache data to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(data));

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default orders;
