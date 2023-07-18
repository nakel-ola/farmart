import { ObjectId } from "mongodb";
import { ResolverFn, UserType } from "../../../../typing";
import redisGet from "../../../utils/redisGet";

interface Args {
  uid?: string;
}
const user: ResolverFn<Args, Omit<UserType, "password"> | null> = async (
  _,
  args,
  ctx
) => {
  try {
    const { uid } = args;
    const { user, userLoader } = ctx;

    // checking if uid does not exists then return auth user
    if (!uid && user) return user.blocked ? null : user;

    // if uid provided, check the database for user
    const key = `user:${uid}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<Omit<UserType, "password">>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // if uid exists
    const customer = await userLoader.load(new ObjectId(uid) as any);

    // if not user with the uid throw error
    if (!customer) return null;

    // cache user to redis
    await ctx.redis.setex(
      key,
      3600,
      JSON.stringify({
        ...customer,
        id: customer.id.toString(),
      })
    );

    //  return customer
    return customer;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default user;
