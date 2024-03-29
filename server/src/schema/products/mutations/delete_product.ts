import { MsgType, ResolverFn } from "../../../../typing";
import getdel from "../../../utils/getdel";
import { ObjectId } from "mongodb";

interface Args {
  id: string;
}
const deleteProduct: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { db, redis } = ctx;
    const data = await db.products.deleteOne({ _id: new ObjectId(args.id) });

    const review = await db.reviews.deleteMany({ productId: args.id });

    if (!data || !review) throw new Error("Something went wrong");

    // getting cache data from redis if available
    await getdel([
      `products*`,
      "product-summary",
      "product*",
      "product-search*",
      "favorite*",
      "favorites*",
    ]);
    return { message: "Deleted Successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default deleteProduct;
