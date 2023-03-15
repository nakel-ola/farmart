import type { AddressType, ResolverFn } from "../../../../typing";
import formatJson from "../../../helper/formatJson";
import redisGet from "../../../helper/redisGet";
import redisKeys from "../../../helper/redisKeys";

interface Args {
  id: string;
}
const address: ResolverFn<Args, Promise<AddressType>> = async (
  _,
  args,
  ctx
) => {
  try {
    const { db, user } = ctx;

    const userId = user?._id.toString();

    const key = `address:${userId}:${args.id}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<AddressType>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const data = await db.addresses.findOne({ userId, _id: args.id });

    if (!data) throw new Error("Something went wrong");

    const newData = formatJson<AddressType>(data);

    // cache data to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(newData));

    return newData;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default address;
