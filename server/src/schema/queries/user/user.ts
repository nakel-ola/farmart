import type { ResolverFn, User } from "../../../../typing";
import clear_id from "../../../helper/clear_id";
import redisGet from "../../../helper/redisGet";

interface Args {
  uid?: string;
}
const user: ResolverFn<Args, Promise<User | null>> = async (_, args, ctx) => {
  try {
    const { uid } = args;
    const { user, userLoader } = ctx;

    // checking if uid does not exists then return auth user
    if (!uid && user)
      return user.blocked ? null : clear_id(user.toJSON ? user.toJSON() : user);

    // if uid provided, check the database for user
    const key = `user:${uid}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<User>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // if uid exists
    const customer = await userLoader.load(uid);

    // if not user with the uid throw error
    if (!customer) return null;

    // cache user to redis
    await ctx.redis.setex(
      key,
      3600,
      JSON.stringify(clear_id(customer.toJSON()))
    );

    //  return customer
    return customer;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default user;
