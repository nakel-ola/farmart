import { MsgType, ResolverFn } from "../../../../typing";
import clean from "../../../utils/clean";
import { ObjectId } from "mongodb";



interface Args {
  input: {
    productId: string;
    reviewId: string;
  };
}

const deleteReview: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { productId, reviewId } = args.input;
    const { req, db, user, redis,isAdmin } = ctx;

    await db.reviews.deleteOne(
      clean({
        productId,
        _id: new ObjectId(reviewId),
        userId: isAdmin ? null : user?.id.toString(),
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
