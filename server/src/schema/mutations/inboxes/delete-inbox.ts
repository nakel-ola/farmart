import type { ResolverFn } from "../../../../typing";

interface Args {
  input: {
    userId: string;
    id: string;
  };
}
const deleteInbox: ResolverFn<Args> = async (_, args, ctx) => {
  try {
    const { id, userId } = args.input;
    const { db, redis } = ctx;

    await db.inboxes.deleteOne({ _id: id });

    // getting deleting cache data from redis if available
    await redis.del(`inboxes:${userId}`);
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default deleteInbox;
