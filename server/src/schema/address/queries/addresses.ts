import { AddressType, ResolverFn } from "../../../../typing";
import redisGet from "../../../utils/redisGet";
import redisKeys from "../../../utils/redisKeys";

const addresses: ResolverFn<any, AddressType[]> = async (_, args, ctx) => {
  try {
    const { db, user } = ctx;

    const userId = user?.id.toString();
    const key = `addresses:${userId}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<AddressType[]>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    await redisKeys("addresses-keys", key);

    const data = (await db.addresses.find({ userId })).map((a) => ({
      ...a,
      id: a.id.toString(),
    }));

    if (!data) throw new Error("Something went wrong");

    // cache data to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(data));

    return data ?? [];
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default addresses;
