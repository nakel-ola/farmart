import { ObjectId } from "mongodb";
import { Level, MsgType, ResolverFn } from "../../../../typing";
import clean from "../../../utils/clean";
import getdel from "../../../utils/getdel";

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

const updateUser: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { uid, ...others } = args.input;
    const { db, user, isAdmin } = ctx;

    if (args.input.level && !isAdmin) throw new Error("Access denied");

    const userId = uid ?? user?.id.toString();

    const data = clean({
      ...others,
      level: isAdmin ? args.input.level : null,
    });

    const updatedUser = await db.users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: data }
    );

    if (!updatedUser) throw new Error("Something went wrong");

    await getdel([`user:${userId}`, `auth-user:${userId}`]);

    return { message: "Successfully updated" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default updateUser;
