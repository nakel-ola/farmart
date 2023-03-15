import type { MsgType, ResolverFn } from "../../../../typing";

interface Args {
  id: string;
}
const deleteBanner: ResolverFn<Args, Promise<MsgType>> = async (
  _,
  args,
  ctx
) => {
  try {
    await ctx.db.banners.deleteOne({ _id: args.id });

    await ctx.redis.del("banners");

    return { message: "Banner deleted successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default deleteBanner;
