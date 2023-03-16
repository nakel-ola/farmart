import type { CurrencyType, ResolverFn } from "../../../../typing";
import clean from "../../../helper/clean";
import getdel from "../../../helper/getdel";

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
const updateProduct: ResolverFn<Args> = async (_, args, ctx) => {
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
