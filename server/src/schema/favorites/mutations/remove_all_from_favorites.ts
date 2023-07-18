import type { MsgType, ResolverFn } from "../../../../typing";
import getdel from "../../../utils/getdel";

const removeAllFromFavorites: ResolverFn<any, MsgType> = async (
  _,
  args,
  ctx
) => {
  try {
    const { db, user } = ctx;
    const userId = user?.id.toString();

    await db.favorites.updateOne({ userId }, { $set: { data: [] } });

    // getting cache data from redis if available
    await getdel([
      `favorite:${userId}*`,
      `favorites:${userId}*`,
      `products:${userId}*`,
      `product:${userId}*`,
      `product-search:${userId}*`,
    ]);

    return { message: "All products removed from favorite" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default removeAllFromFavorites;
