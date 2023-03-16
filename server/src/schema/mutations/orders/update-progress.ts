import type { ResolverFn } from "../../../../typing";
import getdel from "../../../helper/getdel";

interface Args {
  input: {
    id: string;
    name: string;
  };
}
const updateProgress: ResolverFn<Args> = async (_, args, ctx) => {
  try {
    const { id, name } = args.input;
    const { db, redis, user } = ctx;

    const userId = user?._id.toString();

    await db.orders.updateOne(
      { _id: id, "progress.name": name },
      {
        status: name,
        $set: { "progress.$.name": name, "progress.$.checked": true },
      }
    );

    // getting cache data from redis if available
    await getdel([
      `filterById:${userId}*`,
      `filterByStatus:${userId}*`,
      `order:${userId}*`,
      `orders:${userId}*`,
      "orders-statistics",
      "order-summary",
    ]);

    return { message: "Update successful" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default updateProgress;
