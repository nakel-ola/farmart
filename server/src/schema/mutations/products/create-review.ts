import type { MsgType, ResolverFn } from "../../../../typing";

interface Args {
  input: {
    productId: string;
    name: string;
    title: string;
    rating: number;
    message: string;
  };
}
const createReview: ResolverFn<Args, Promise<MsgType>> = async (
  _,
  args,
  ctx
) => {
  try {
    const { productId, rating, ...others } = args.input;
    const { db, user, redis } = ctx;

    const newReview = {
      ...others,
      userId: user?._id.toString(),
      rating,
      productId,
    };

    await db.reviews.create(newReview);

    await db.products.updateOne(
      { _id: productId, "rating.name": rating },
      { $inc: { "rating.$.value": 1 } }
    );

    const key = `reviews:${productId}`;

    await redis.del(key);

    return { message: "Successfully added review" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default createReview;
