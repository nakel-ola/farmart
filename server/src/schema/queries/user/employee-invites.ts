import type { InviteType, ResolverFn } from "../../../../typing";
import redisGet from "../../../helper/redisGet";

const employeeInvites: ResolverFn<any, Promise<InviteType[]>> = async (
  _,
  args,
  ctx
) => {
  try {
    const key = "employee-invites";

    // getting cache data from redis if available
    const redisCache = await redisGet<InviteType[]>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const data = await ctx.db.invites.find({});

    // cache data to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(data));

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default employeeInvites;
