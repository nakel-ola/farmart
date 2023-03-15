import { compareSync } from "bcryptjs";
import type { HydratedDocument } from "mongoose";
import type { MsgType, ResolverFn, UserType } from "../../../../typing";
import signToken from "../../../helper/signToken";

interface Args {
  input: {
    email: string;
    password: string;
  };
}

type User = HydratedDocument<Pick<UserType, "blocked" | "password">> | null;

const login: ResolverFn<Args, Promise<MsgType>> = async (_, args, ctx) => {
  try {
    const { email, password } = args.input;

    const { db, req } = ctx;

    // checking if user with email exists
    const user: User = await db.users.findOne(
      { email },
      { blocked: 1, password: 1 }
    );

    // if user with email not exists throw error
    if (!user) throw new Error("Something went wrong");

    // checking if existing user is blocked if blocked throw error
    if (user?.blocked) throw new Error("Account blocked");

    // comparing entered password with db password
    const isPassword = compareSync(password, user.password);

    // if entered password is not equal to db password throw error
    if (!isPassword) throw new Error("Something went wrong");

    // signing token with id and email
    let token = signToken(user._id.toString(), email);

    // updating cookie
    (req.session as any).auth = token;

    return { message: "Login successful" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default login;
