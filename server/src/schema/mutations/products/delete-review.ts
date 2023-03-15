import type { MsgType, ResolverFn } from "../../../../typing";
import clean from "../../../helper/clean";

interface Args {
  input: {
    productId: string;
    reviewId: string;
  };
}
const deleteReview: ResolverFn<Args, Promise<MsgType>> = async (
  _,
  args,
  ctx
) => {
  try {
    const { productId, reviewId } = args.input;
    const { req, db, user, redis } = ctx;

    await db.reviews.deleteOne(
      clean({
        productId,
        _id: reviewId,
        userId: req.admin ? null : user?._id.toString(),
      })
    );

    const key = `reviews:${productId}`;

    await redis.del(key);

    return { message: "Successfully deleted review" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default deleteReview;
