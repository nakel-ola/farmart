import { ObjectId } from "mongodb";
import { MsgType, ResolverFn } from "../../../../typing";

interface Args {
  id: string;
}

const deleteEmployeeInvite: ResolverFn<Args, MsgType> = async (
  _,
  args,
  ctx
) => {
  try {
    const { id } = args;
    const { db, redis } = ctx;

    await db.invites.deleteOne({ _id: new ObjectId(id) });

    await redis.del("employee-invites");
    return { message: "Invite deleted successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default deleteEmployeeInvite;
