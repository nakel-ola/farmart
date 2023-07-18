import { MsgType, ResolverFn } from "../../../../typing";

interface Args {
  categories: string[];
}
const deleteCategories: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { db } = ctx;
    const categories = args.categories.map((category) => ({ name: category }));

    for (let i = 0; i < categories.length; i++) {
      const element = categories[i];
      await db.categories.deleteOne({ name: element.name });
    }

    // deleting categories cache
    await ctx.redis.del("categories");

    return { message: "Categories deleted successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default deleteCategories;
