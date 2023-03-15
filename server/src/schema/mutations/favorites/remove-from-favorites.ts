import type { ResolverFn } from "../../../../typing";
import getdel from "../../../helper/getDel";
import redisGet from "../../../helper/redisGet";

interface Args {
  id: string;
}
const removeFromFavorites: ResolverFn<Args> = async (_, args, ctx) => {
  try {
    const { db, user, redis } = ctx;

    const userId = user?._id.toString();
    const favorite = await db.favorites.findOne({ userId });

    if (!favorite) throw new Error("Something went wrong");

    await db.favorites.updateOne({ userId }, { $pull: { data: args.id } });

    // getting cache data from redis if available
    await getdel([
      `favorite:${userId}*`,
      `favorites:${userId}*`,
      `products:${userId}*`,
      `product:${userId}*`,
      `product-search:${userId}*`,
    ]);

    return { message: "Product removed from favorite" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default removeFromFavorites;
