import * as argon from "argon2";
import { ResolverFn } from "../../../../typing.d";
import config from "../../../config";
import emailer from "../../../utils/emailer";
import { ForbiddenException } from "../../../utils/exceptions";
import signToken from "../signToken";
import { welcomeMsg } from "../../../data/emailData";

interface Args {
  input: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    inviteCode?: string;
  };
}

export type TokenType = {
  accessToken: string;
  refreshToken: string;
}

const register: ResolverFn<Args, TokenType> = async (_, args, ctx) => {
  try {
    const { email, name, password, phoneNumber, inviteCode } = args.input;

    const { db, isAdmin } = ctx;

    let validate = null;

    if (isAdmin && !inviteCode) throw new Error("Invite code is required");

    if (isAdmin) {
      validate = await db.invites.findOne({ where: { email, inviteCode } });

      if (!validate) throw new Error("Something went wrong");
    }

    const user = await db.users.findOne({
      where: { email },
      select: ["email"],
    });

    if (user) throw ForbiddenException(`User ${user.email} already exists`);

    // hashing the password
    const hash = await argon.hash(password);

    const newUser = await db.users
      .create({
        name,
        email,
        phoneNumber,
        password: hash,
        gender: null,
        blocked: false,
        photoUrl: null,
        birthday: null,
        level: isAdmin ? validate?.level! : null,
      })
      .save();

    await emailer({
      to: email,
      subject: `Welcome to the ${config.app_name} family!`,
      html: welcomeMsg({ name }),
    });

    // signing access token with id and email
    const accessToken = signToken(newUser.id.toString(), newUser.email);

    // signing refresh token with id and email
    const refreshToken = signToken(
      newUser.id.toString(),
      newUser.email,
      config.refresh_expires_in
    );

    return { accessToken, refreshToken };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default register;
