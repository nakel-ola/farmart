import * as argon from "argon2";
import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import { MsgType, ResolverFn } from "../../../../typing";
import { passwordChangeMail } from "../../../data/emailData";
import emailer from "../../../utils/emailer";
import { NotFoundException } from "../../../utils/exceptions";

interface Args {
  input: {
    oldPassword: string;
    newPassword: string;
  };
}

const updatePassword: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { newPassword, oldPassword } = args.input;

    const { db, user } = ctx;

    const userId = user?.id.toString(),
      email = user?.email!;

    const userPs = await db.users.findOne({
      where: { _id: new ObjectId(userId) },
      select: ["password"],
    });

    if (!userPs) throw NotFoundException("Something went wrong");

    const isPassword = argon.verify(userPs?.password, oldPassword);

    if (!isPassword) throw new GraphQLError("Something went wrong");

    const hash = argon.hash(newPassword);

    const newUser = await db.users.updateOne(
      { _id: userId },
      { $set: { password: hash } }
    );

    if (!newUser) throw new GraphQLError("Something went wrong");

    await emailer({
      to: email,
      subject: "	Your password was changed",
      html: passwordChangeMail({ name: user?.name!, email }),
    });

    return { message: "Password updated successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export default updatePassword;
