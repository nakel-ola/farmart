import * as argon from "argon2";
import { compareSync } from "bcryptjs";
import { MsgType, ResolverFn } from "../../../../typing";
import config from "../../../config";
import signToken from "../signToken";
import { TokenType } from "./register";

interface Args {
  input: {
    email: string;
    password: string;
  };
}
const login: ResolverFn<Args, TokenType> = async (_, args, ctx) => {
  try {
    const { email, password } = args.input;

    const { db, req } = ctx;

    // checking if user with email exists
    const user = await db.users.findOne({
      where: { email },
      select: ["blocked", "password"],
    });

    // if user with email not exists throw error
    if (!user) throw new Error("Something went wrong");

    // checking if existing user is blocked if blocked throw error
    if (user?.blocked) throw new Error("Account blocked");

    // comparing entered password with db password
    const isPassword = argon.verify(user.password, password);

    // if entered password is not equal to db password throw error
    if (!isPassword) throw new Error("Something went wrong");

    // signing access token with id and email
    const accessToken = signToken(user.id.toString(), user.email);

    // signing refresh token with id and email
    const refreshToken = signToken(
      user.id.toString(),
      user.email,
      config.refresh_expires_in
    );

    return { accessToken, refreshToken };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default login;
