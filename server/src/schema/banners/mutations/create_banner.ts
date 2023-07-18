import { MsgType, ResolverFn } from "../../../../typing";

interface Args {
  input: {
    image: string;
    title: string;
    description: string;
    link?: string;
  };
}
const createBanner: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { title, image, description, link } = args.input;
    await ctx.db.banners.create({ description, image, link, title }).save();

    await ctx.redis.del("banners");

    return { message: "Banner created successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default createBanner;
