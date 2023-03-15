import type { CouponType, ResolverFn } from "../../../../typing";

interface Args {
  input: {
    email: string;
    coupon: string;
  };
}
const verifyCoupon: ResolverFn<Args, Promise<CouponType>> = async (
  _,
  args,
  ctx
) => {
  try {
    const { coupon, email } = args.input;
    const { db, user } = ctx;

    const data = await db.coupons.findOne({
      userId: user?._id.toString(),
      email,
      coupon,
    });

    if (!data) throw new Error("Invalid coupon code");

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default verifyCoupon;
