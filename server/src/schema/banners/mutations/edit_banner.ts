import { ObjectId } from "mongodb";
import { MsgType, ResolverFn } from "../../../../typing";
import clean from "../../../utils/clean";

interface Args {
  input: {
    id: string;
    title: string;
    description: string;
    link: string;
    image: string;
  };
}

const editBanner: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { id, ...others } = args.input;
    await ctx.db.banners.updateOne(
      { _id: new ObjectId(id), },
      { $set: clean(others) }
    );

    await ctx.redis.del("banners");

    return { message: "Banner created successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default editBanner;
