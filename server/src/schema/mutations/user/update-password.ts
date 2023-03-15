import { compareSync } from "bcryptjs";
import type { Context, MsgType, ResolverFn } from "../../../../typing";
import { passwordChangeMail } from "../../../data/emailData";
import emailer from "../../../helper/emailer";
import { NotFoundException } from "../../../helper/exceptions";
import generateHash from "../../../helper/generateHash";
import signToken from "../../../helper/signToken";

interface Args {
  input: {
    oldPassword: string;
    newPassword: string;
  };
}

const updatePassword: ResolverFn<Args, Promise<MsgType>> = async (
  _: any,
  args: Args,
  ctx: Context
) => {
  try {
    const { newPassword, oldPassword } = args.input;

    const { db, req, user } = ctx;

    const userId = user?._id.toString(),
      email = user?.email!;

    if (newPassword !== oldPassword) throw new Error("Passwords do not match");

    const userPs = await db.users.findOne({ _id: userId }, { password: 1 });

    if (!userPs) throw NotFoundException("Something went wrong");

    const isPassword = compareSync(oldPassword, userPs?.password);

    if (!isPassword) throw new Error("Something went wrong");

    const hash = generateHash(newPassword);

    const newUser = await db.users.updateOne(
      { _id: userId },
      { password: hash }
    );

    if (!newUser) throw new Error("Something went wrong");

    req.session.destroy((err) => {
      if (err) throw new Error(err.message);
    });

    const token = signToken(userId!, email);

    (req.session as any).auth = token;

    await emailer({
      from: '"Grocery Team" noreply@grocery.com',
      to: email,
      subject: "	Your password was changed",
      html: passwordChangeMail({ name: user?.name!, email }),
    });

    return { message: "Password updated successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default updatePassword;
