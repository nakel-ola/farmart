import { ProductType, ResolverFn } from "../../../../typing";
import clean from "../../../utils/clean";
import redisGet from "../../../utils/redisGet";

interface Args {
  input: {
    outOfStock: boolean;
    genre: string;
    offset: number;
    limit: number;
  };
}

interface ReturnValue {
  genre: string;
  totalItems: number;
  results: (ProductType & { favorite: boolean })[];
}

const products: ResolverFn<Args, ReturnValue> = async (_, args, ctx) => {
  try {
    const { genre, limit, offset, outOfStock } = args.input;
    const { db, isAdmin, user } = ctx;

    if (outOfStock && !isAdmin)
      throw new Error("You dont have admin permission");

    const userId = user ? user?.id?.toString() : null;

    const key = `products${userId ? `:${userId}` : ""}${
      genre ? `:${genre}` : ""
    }?offset=${offset}&limit=${limit}${
      outOfStock ? "&outOfStock=${outOfStock}" : ""
    }`;

    // getting cache data from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    let filter = clean({ stock: outOfStock ? 0 : null, category: genre });

    // let data = await db.products.find(filter, null, { limit, skip: offset });
    let data = await db.products.find({
      where: filter,
      skip: offset,
      take: limit,
    });

    const favorites = user
      ? await db.favorites.findOne({ where: { userId } })
      : null;

    const getFavorite = (id: string) => !!favorites?.data.find((f) => f === id);

    const results = data.map((d) => ({
      ...d,
      id: d.id.toString(),
      favorite: favorites ? getFavorite(d.id.toString()) : false,
    }));

    let totalItems = await db.products.count(filter);

    let newData = {
      genre: genre,
      totalItems,
      results,
    };

    await ctx.redis.setex(key, 3600, JSON.stringify(newData));
    return newData;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};
export default products;
