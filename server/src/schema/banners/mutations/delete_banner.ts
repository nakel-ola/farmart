import { ObjectId } from "mongodb";
import { MsgType, ResolverFn } from "../../../../typing";

interface Args {
  id: string;
}

const deleteBanner: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    await ctx.db.banners.deleteOne({ _id: new ObjectId(args.id) });

    await ctx.redis.del("banners");

    return { message: "Banner deleted successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default deleteBanner;
