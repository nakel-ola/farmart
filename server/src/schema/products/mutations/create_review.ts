import { ObjectId } from "mongodb";
import { MsgType, ResolverFn } from "../../../../typing";

interface Args {
  input: {
    productId: string;
    name: string;
    title: string;
    rating: number;
    message: string;
  };
}

const createReview: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { productId, rating, ...others } = args.input;
    const { db, user, redis } = ctx;

    const newReview = {
      ...others,
      userId: user?.id.toString(),
      rating,
      productId,
    };

    await db.reviews.create(newReview).save();

    await db.products.updateOne(
      { _id: new ObjectId(productId), "rating.name": rating },
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
