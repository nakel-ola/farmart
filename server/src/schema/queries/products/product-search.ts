import type { Product, ResolverFn } from "../../../../typing";
import clean from "../../../helper/clean";
import clear_id from "../../../helper/clear_id";
import redisGet from "../../../helper/redisGet";


interface Args {
  input: {
    search: string;
    outOfStock: boolean;
    category: string[];
    price: number[];
    discount: string[];
    rating: number;
    offset: number;
    limit: number;
  };
}

interface ReturnValue {
  search: string;
  totalItems: number;
  results: Product[];
}

const productSearch: ResolverFn<Args, Promise<ReturnValue>> = async (
  _,
  args,
  ctx
) => {
  try {
    const {
      price = [0, Infinity],
      discount,
      category,
      outOfStock,
      search,
      offset,
      limit,
    } = args.input;
    const { db, user } = ctx;

    const userId = user ? user?._id?.toString() : null;

    const dis = discount ? `&discount=${discount?.join(",")}` : "";
    const cat = category ? `&category=${category?.join(",")}` : "";
    const priceKey = price ? `&price=${price?.join(",")}` : "";

    const key = `product-search${
      userId ? `:${userId}` : ""
    }:${search}?outOfStock=${outOfStock}&offset=${offset}&limit=${limit}${priceKey}${dis}${cat}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    let filter = clean({
      price: price ? { $lte: price[1], $gte: price[0] } : null,
      discount: discount ? { $in: discount } : null,
      category: category ? { $in: category } : null,
      stock: outOfStock ? 0 : null,
      $or: [
        { title: new RegExp(search, "i") },
        { category: new RegExp(search, "i") },
      ],
    });

    // getting products with the filter
    const results = (
      await db.products.find(filter, null, {
        limit,
        skip: offset,
      })
    ).map((r) => r.toJSON());

    // getting total number of product with the filter
    const totalItems = await db.products.count(filter);

    let newData = {
      search,
      totalItems,
      results: clear_id(results),
    };

    // cache product to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(newData));

    return newData;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default productSearch;
