import type { ResolverFn } from "../../../../typing";
import getdel from "../../../helper/getdel";


interface Args {
  id: string;
}
const addToFavorites: ResolverFn<Args> = async (_, args, ctx) => {
  try {
    const { id } = args;
    const { db, user, redis } = ctx;

    const userId = user?._id.toString();

    const favorite = await db.favorites.findOne({ userId });

    if (favorite)
      await db.favorites.updateOne({ userId }, { $push: { data: id } });
    else await db.favorites.create({ userId, data: [id] });

    // getting cache data from redis if available
    await getdel([
      `favorite:${userId}*`,
      `favorites:${userId}*`,
      `products:${userId}*`,
      `product:${userId}*`,
      `product-search:${userId}*`,
    ]);

    return { message: "Products add to favorites" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default addToFavorites;
