import type { Context, Level, MsgType, ResolverFn } from "../../../../typing";
import clean from "../../../helper/clean";
import getdel from "../../../helper/getdel";

interface Args {
  input: {
    uid?: string;
    name?: string;
    gender?: string;
    birthday?: Date;
    phoneNumber?: string;
    photoUrl?: string;
    level?: Level;
  };
}

const updateUser: ResolverFn<Args, Promise<MsgType>> = async (
  _: any,
  args: Args,
  ctx: Context
) => {
  try {
    const { uid, ...others } = args.input;
    const { db, user, req } = ctx;

    if (args.input.level && !req.admin) throw new Error("Access denied");

    const userId = uid ?? user?._id.toString();

    const data = clean({
      ...others,
      level: req.admin ? args.input.level : null,
    });

    const updatedUser = await db.users.updateOne({ _id: userId }, data);

    if (!updatedUser) throw new Error("Something went wrong");

    await getdel([`user:${userId}`, `auth-user:${userId}`]);

    return { message: "Successfully updated" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default updateUser;
