import { ObjectId } from "mongodb";
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

    await db.inboxes.deleteOne({ _id: new ObjectId(id) });

    // getting deleting cache data from redis if available
    await redis.del(`inboxes:${userId}`);

    return { message: "Inbox Deleted successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default deleteInbox;
