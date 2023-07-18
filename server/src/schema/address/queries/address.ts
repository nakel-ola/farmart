import { ObjectId } from "mongodb";
import { AddressType, ResolverFn } from "../../../../typing";
import redisGet from "../../../utils/redisGet";

interface Args {
  id: string;
}

const address: ResolverFn<Args, AddressType> = async (_, args, ctx) => {
  try {
    const { db, user } = ctx;

    const userId = user?.id.toString();

    const key = `address:${userId}:${args.id}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<AddressType>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const data = await db.addresses.findOne({
      where: { userId, _id: new ObjectId(args.id) },
    });

    if (!data) throw new Error("Something went wrong");

    const newData = { ...data, id: data.id.toString() };

    // cache data to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(newData));

    return newData;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default address;
