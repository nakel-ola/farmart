import { GraphQLError } from "graphql";
import { AddressType, ResolverFn, UserType } from "../../../../typing";
import redisGet from "../../../utils/redisGet";

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

const users: ResolverFn<Args, ReturnValue> = async (_, args, ctx) => {
  try {
    const { page, limit = 10, employee = false } = args.input;
    const { addressLoader, redis, user, db,isAdmin } = ctx;

    let skip = (page - 1) * limit;


    if (employee && !isAdmin) throw new GraphQLError("Permission denied");

    const key = `users:${user?.id.toString()}?page=${page}&employee=${employee}`;

    // getting cache data from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // finding users
    const data = await db.users.find({
      where: employee
        ? { level: { $in: ["Gold", "Silver", "Bronze"] } }
        : { level: null },
      skip,
      take: limit,
    });

    // getting users id
    const ids = data.map((d) => d.id);

    // finding users addresses with there id
    const addresses = await addressLoader.loadMany(ids);

    // merging addresses with users
    const results = data.map((d) => ({
      ...d,
      id: d.id.toString(),
      addresses: (addresses as AddressType[])
        .filter((ad) => ad.userId === d.id.toString())
        .map((a) => ({ ...a, id: (a as any).id.toString() })),
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
