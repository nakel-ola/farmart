import type { InboxType, ResolverFn } from "../../../../typing";
import formatJson from "../../../helper/formatJson";
import redisGet from "../../../helper/redisGet";

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
const inboxes: ResolverFn<Args, Promise<ReturnValue>> = async (
  _,
  args,
  ctx
) => {
  try {
    const { db, user, req } = ctx;
    const { customerId, limit, page } = args.input;

    const skip = (page - 1) * limit,
      userId = !req.admin ? user?._id.toString() : customerId;

    const key = `inboxes:${userId}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const results = formatJson<InboxType[]>(
      await db.inboxes.find({ userId }, null, { skip, limit })
    );
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
