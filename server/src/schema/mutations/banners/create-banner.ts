import type { MsgType, ResolverFn } from "../../../../typing";
import clean from "../../../helper/clean";

interface Args {
  input: {
    image: string;
    title: string;
    description: string;
    link?: string;
  };
}
const createBanner: ResolverFn<Args, Promise<MsgType>> = async (
  _,
  args,
  ctx
) => {
  try {
    await ctx.db.banners.create(clean(args.input));

    await ctx.redis.del("banners");

    return { message: "Banner created successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default createBanner;
