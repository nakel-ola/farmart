import type { MsgType, ResolverFn } from "../../../../typing";

interface Args {
  id: string;
}

const deleteEmployeeInvite: ResolverFn<Args, Promise<MsgType>> = async (
  _,
  args,
  ctx
) => {
  try {
    const { id } = args;
    const { db, redis } = ctx;

    await db.invites.deleteOne({ _id: id });

    await redis.del("employee-invites");
    return { message: "Invite deleted successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default deleteEmployeeInvite;
