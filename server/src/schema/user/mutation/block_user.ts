import { ObjectId } from "mongodb";
import { ResolverFn } from "../../../../typing";
import getdel from "../../../utils/getdel";

interface Args {
  input: {
    customerId: string;
    blocked: boolean;
    email: string;
  };
}

const blockUser: ResolverFn<Args> = async (_, args, ctx) => {
  try {
    const { email, blocked, customerId } = args.input;

    const { isAdmin, db } = ctx;

    if (!isAdmin) throw Error("You don't have permission to block this user");

    const user = await db.users.updateOne(
      { _id: new ObjectId(customerId), email },
      { blocked }
    );

    if (!user) throw new Error("Something went wrong");

    await getdel([`user:${customerId}`, `auth-user:${customerId}`]);

    return { message: "User Blocked successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default blockUser;
