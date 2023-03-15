import type { MsgType, ResolverFn } from "../../../../typing";

interface Args {
  categories: string[];
}
const createCategories: ResolverFn<Args, Promise<MsgType>> = async (
  _,
  args,
  ctx
) => {
  try {
    const { db } = ctx;
    const categories = args.categories.map((category) => ({
      name: category,
    }));

    await db.categories.insertMany(categories);

    // deleting categories cache
    await ctx.redis.del("categories");

    return { message: "Categories added successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default createCategories;
