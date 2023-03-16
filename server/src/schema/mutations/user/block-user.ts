import type { MsgType, ResolverFn } from "../../../../typing";
import getdel from "../../../helper/getdel";

interface Args {
  input: {
    customerId: string;
    blocked: boolean;
    email: string;
  };
}

const blockUser: ResolverFn<Args, Promise<MsgType>> = async (_, args, ctx) => {
  try {
    const { email, blocked, customerId } = args.input;

    const { req, db } = ctx;

    if (!req.admin) throw Error("You don't have permission to block this user");

    const user = await db.users.updateOne(
      { _id: customerId, email },
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
