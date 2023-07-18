import type { ResolverFn } from "../../../../typing";
import getdel from "../../../utils/getdel";

interface Args {
  id: string;
}
const addToFavorites: ResolverFn<Args> = async (_, args, ctx) => {
  try {
    const { id } = args;
    const { db, user } = ctx;

    const userId = user?.id.toString();

    const favorite = await db.favorites.findOne({ where: { userId } });

    if (favorite)
      await db.favorites.updateOne({ userId }, { $push: { data: id } } as any);
    else await db.favorites.create({ userId, data: [id] }).save();

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
