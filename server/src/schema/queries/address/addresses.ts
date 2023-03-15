import type { AddressType, ResolverFn } from "../../../../typing";
import formatJson from "../../../helper/formatJson";
import redisGet from "../../../helper/redisGet";
import redisKeys from "../../../helper/redisKeys";

const addresses: ResolverFn<any, Promise<AddressType[]>> = async (
  _,
  args,
  ctx
) => {
  try {
    const { db, user } = ctx;

    const userId = user?._id.toString();
    const key = `addresses:${userId}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<AddressType[]>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    await redisKeys("addresses-keys", key);

    const data = formatJson<AddressType[]>(await db.addresses.find({ userId }));

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
