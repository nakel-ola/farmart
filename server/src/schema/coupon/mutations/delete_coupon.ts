import { ObjectId } from "mongodb";
import { MsgType, ResolverFn } from "../../../../typing";

interface Args {
  input: {
    userId: string;
    id: string;
  };
}
const deleteCoupon: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { userId, id } = args.input;
    const { db, redis } = ctx;
    const data = await db.coupons.deleteOne({ _id: new ObjectId(id) });

    if (!data) throw new Error("Something went wrong");

    await redis.del(`coupons:${userId}`);

    return { message: "Coupon deleted successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default deleteCoupon;
