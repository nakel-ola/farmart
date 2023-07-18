import { MsgType, ResolverFn } from "../../../../typing";
import generateCoupon from "../../../utils/generateCoupon";

interface Args {
  input: {
    discount: number;
    email: string;
    description?: string;
    userId: string;
    expiresIn: Date;
  };
}

const createCoupon: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { discount, email, expiresIn, userId, description } = args.input;
    const { db, user } = ctx;

    const code = generateCoupon(9);

    const data = await db.coupons
      .create({
        discount,
        email,
        description,
        userId,
        code,
        expiresIn,
      })
      .save();

    if (!data) throw new Error("Something went wrong");

    await ctx.redis.del(`coupons:${userId ?? user?.id.toString()}`);

    return { message: "Coupon created successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default createCoupon;
