import type { ResolverFn } from "../../../../typing";
import redisGet from "../../../utils/redisGet";

interface ReturnType {
  totalOrders: number;
  totalDelivered: number;
  outOfStock: number;
  totalStock: number;
}
const productsSummary: ResolverFn<any, ReturnType> = async (
  _,
  args,
  ctx
) => {
  try {
    const { db } = ctx;

    const key = `product-summary`;

    // getting cache data from redis if available
    const redisCache = await redisGet<ReturnType>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const products = await db.products.find();
    const orders = await db.orders.find();

    let totalDelivered: number = 0;

    for (let i = 0; i < orders.length; i++) {
      let element = orders[i].progress;

      let checked = element.find(
        (r) => r.name.toLowerCase() === "delivered" && r.checked
      );
      if (checked) totalDelivered += 1;
    }

    const data = {
      totalOrders: orders.length,
      totalDelivered,
      totalStock: products.reduce((amount, item) => amount + item.stock, 0),
      outOfStock: products.filter((product) => product.stock === 0).length,
    };

    // cache product to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(data));

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default productsSummary;
