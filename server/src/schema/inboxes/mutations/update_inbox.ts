import { ObjectId } from "mongodb";
import type { ResolverFn } from "../../../../typing";

interface Args {
  input: {
    title: string;
    description: string;
    userId: string;
    id: string;
  };
}
const updateInbox: ResolverFn<Args> = async (_, args, ctx) => {
  try {
    const { db, redis } = ctx;

    const { description, id, userId, title } = args.input;

    await db.inboxes.updateOne(
      { _id: new ObjectId(id), userId },
      { title, description }
    );

    // getting deleting cache data from redis if available
    await redis.del(`inboxes:${userId}`);

    return { message: "Inbox modify successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default updateInbox;
