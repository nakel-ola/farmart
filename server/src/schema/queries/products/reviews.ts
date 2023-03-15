import type { ResolverFn, ReviewType } from "../../../../typing";
import clear_id from "../../../helper/clear_id";
import redisGet from "../../../helper/redisGet";

interface Args {
  productId: string;
}
const reviews: ResolverFn<Args, Promise<ReviewType[]>> = async (
  _,
  args,
  ctx
) => {
  try {
    const key = `reviews:${args.productId}`;

    // getting cache friend-request from redis if available
    const redisCache = await redisGet<ReviewType[]>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const data = (await ctx.db.reviews.find({ productId: args.productId })).map(
      (d) => d.toJSON()
    );

    if (!data) throw new Error("Something went wrong");

    // cache reviews to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(clear_id(data)));

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default reviews;
