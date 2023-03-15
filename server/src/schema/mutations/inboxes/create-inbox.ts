import type { ResolverFn } from "../../../../typing";

interface Args {
  input: {
    title: string;
    description: string;
    userId: string;
  };
}
const createInbox: ResolverFn<Args> = async (_, args, ctx) => {
  try {
    const { db, redis } = ctx;
    await db.inboxes.create(args.input);

    // getting deleting cache data from redis if available
    await redis.del(`inboxes:${args.input.userId}`);

    return { message: "Inbox created successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default createInbox;
