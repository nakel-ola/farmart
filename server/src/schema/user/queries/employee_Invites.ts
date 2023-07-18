import { InviteType, ResolverFn } from "../../../../typing";
import redisGet from "../../../utils/redisGet";

const employeeInvites: ResolverFn<any, InviteType[]> = async (_, args, ctx) => {
  try {
    const { db, redis } = ctx;
    const key = "employee-invites";

    // getting cache data from redis if available
    const redisCache = await redisGet<InviteType[]>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const data = await db.invites.find({});

    // cache data to redis
    await redis.setex(key, 3600, JSON.stringify(data));

    return data as any;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default employeeInvites;
