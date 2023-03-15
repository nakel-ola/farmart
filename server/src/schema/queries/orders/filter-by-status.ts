import type { OrderType, ResolverFn } from "../../../../typing";
import formatJson from "../../../helper/formatJson";
import redisGet from "../../../helper/redisGet";

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
    const { req, user, db } = ctx;

    const userId = user?._id.toString();

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

    const filter = req.admin ? adminFilter : noAdminFilter;

    const results = formatJson<OrderType[]>(
      await db.orders.find(filter, null, { limit, skip })
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

export default filterByStatus;
