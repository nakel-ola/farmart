import type { AddressType, ResolverFn, UserType } from "../../../../typing";
import { userSelect } from "../../../context";
import clear_id from "../../../helper/clear_id";
import formatJson from "../../../helper/formatJson";
import redisGet from "../../../helper/redisGet";

interface Args {
  input: {
    employee: boolean;
    page: number;
    limit?: number;
  };
}

interface ReturnValue {
  page: number;
  totalItems: number;
  results: Omit<UserType & { addresses: AddressType[] }, "password">[];
}

const users: ResolverFn<Args, Promise<ReturnValue>> = async (_, args, ctx) => {
  try {
    const { page, limit = 10, employee = false } = args.input;
    const { addressLoader, redis, user } = ctx;

    let skip = (page - 1) * limit;

    const { db, req } = ctx;

    if (employee && !req.admin) throw new Error("Permission denied");

    const key = `users:${user?._id.toString()}?page=${page}&employee=${employee}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // finding users
    const data = formatJson<(UserType & { id: string })[]>(
      await db.users.find(
        employee
          ? { level: { $in: ["Gold", "Silver", "Bronze"] } }
          : { level: null },
        userSelect,
        { limit, skip }
      )
    );

    // getting users id
    const ids = data.map((d) => d.id);

    // finding users addresses with there id
    const addresses = await addressLoader.loadMany(ids);

    // merging addresses with users
    const results = data.map((d) => ({
      ...d,
      addresses: clear_id(
        (addresses as AddressType[]).filter((ad) => ad.userId === d.id)
      ),
    }));

    // getting total length of users
    const totalItems = await db.users.count();

    const returnResult = {
      page,
      totalItems,
      results,
    };

    // cache users to redis
    await redis.setex(key, 3600, JSON.stringify(returnResult));

    return returnResult;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default users;
