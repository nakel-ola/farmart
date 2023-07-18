import type { ProductType, ResolverFn } from "../../../../typing";
import redisGet from "../../../utils/redisGet";

interface Args {
  id: string;
}
const favorite: ResolverFn<Args, ProductType | null> = async (_, args, ctx) => {
  try {
    const { db, user, productLoader } = ctx;

    const userId = user?.id.toString();

    const key = `favorite:${userId}:${args.id}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<ProductType>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const favorite = await db.favorites.findOne({ where: { userId } });

    if (!favorite || favorite.data.length === 0) return null;

    const id = favorite.data.find((p) => p === args.id);

    if (!id) return null;

    const product = await productLoader.load(id);

    return { ...product, id: product.id.toString() };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default favorite;
