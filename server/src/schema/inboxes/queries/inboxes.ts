import type { InboxType, ResolverFn } from "../../../../typing";
import redisGet from "../../../utils/redisGet";

interface Args {
  input: {
    page: number;
    limit: number;
    customerId: string;
  };
}

interface ReturnValue {
  page: number;
  totalItems: number;
  results: InboxType[];
}
const inboxes: ResolverFn<Args, ReturnValue> = async (
  _,
  args,
  ctx
) => {
  try {
    const { db, user, req, isAdmin } = ctx;
    const { customerId, limit, page } = args.input;

    const skip = (page - 1) * limit,
      userId = !isAdmin ? user?.id.toString() : customerId;

    const key = `inboxes:${userId}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // null, { skip, limit }
    const results = await db.inboxes.find({
      where: { userId },
      skip,
      take: limit,
    });
    const totalItems = await db.inboxes.count({ userId });

    const data = { page, totalItems, results };

    // cache data to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(data));

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default inboxes;
