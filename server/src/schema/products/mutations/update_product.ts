import { CurrencyType, MsgType, ResolverFn } from "../../../../typing";
import clean from "../../../utils/clean";
import getdel from "../../../utils/getdel";

interface Args {
  input: {
    id: string;
    title: string;
    slug: string;
    category: string;
    description: string;
    image: string;
    price: number;
    stock: number;
    currency: CurrencyType;
  };
}
const updateProduct: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { id, ...others } = args.input;
    const { db, redis } = ctx;

    const data = clean(others);

    const user = await db.products.updateOne({ _id: id }, data);

    if (!user) throw new Error("Something went wrong");

    // getting cache data from redis if available
    await getdel([
      `products*`,
      "product-summary",
      "product*",
      "product-search*",
      "favorite*",
      "favorites*",
    ]);

    return { message: "Successfully updated" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default updateProduct;
