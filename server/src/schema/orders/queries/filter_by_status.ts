import type { OrderType, ResolverFn } from "../../../../typing";
import redisGet from "../../../utils/redisGet";

interface Args {
  input: {
    page: number;
    limit: number;
    status: string;
  };
}

interface ReturnValue {
  status: string;
  page: number;
  totalItems: number;
  results: OrderType[];
}
const filterByStatus: ResolverFn<Args> = async (_, args, ctx) => {
  try {
    const { status, limit, page } = args.input;
    const { req, user, db, isAdmin } = ctx;

    const userId = user?.id.toString();

    const key = `filterByStatus:${userId}:${status}?limit=${limit}&page=${page}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const isAll = status === "all",
      skip = (page - 1) * limit;

    const progressFilter = {
      progress: {
        $elemMatch: {
          name: status,
          checked: true,
        },
      },
    };

    const adminFilter = isAll ? {} : progressFilter;
    const noAdminFilter = isAll ? { userId } : { userId, ...progressFilter };

    const filter = isAdmin ? adminFilter : noAdminFilter;

    const results = await db.orders.find({ where: filter, take: limit, skip });
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

export default filterByStatus;
