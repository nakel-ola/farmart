import type { MsgType, ResolverFn } from "../../../../typing";
import currencies from "../../../data/currencies.json";
import getdel from "../../../helper/getdel";

interface Args {
  input: {
    title: string;
    slug: string;
    category: string;
    description: string;
    image: string;
    price: number;
    stock: number;
    discount?: string;
  };
}

const createProduct: ResolverFn<Args, Promise<MsgType>> = async (
  _,
  args,
  ctx
) => {
  try {
    const { db } = ctx;
    const data = {
      ...args.input,
      rating: defaultRating,
      currency: currencies[0],
    };

    const newData = await db.products.create(data);

    if (!newData) throw new Error("Something went wrong");

    // getting cache data from redis if available
    await getdel([
      `products*`,
      "product-summary",
      "product*",
      "product-search*",
      "favorite*",
      "favorites*",
    ]);

    return { message: "Created successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

const defaultRating = [
  {
    name: "5",
    value: 0,
  },
  {
    name: "4",
    value: 0,
  },
  {
    name: "3",
    value: 0,
  },
  {
    name: "2",
    value: 0,
  },
  {
    name: "1",
    value: 0,
  },
];
export default createProduct;
