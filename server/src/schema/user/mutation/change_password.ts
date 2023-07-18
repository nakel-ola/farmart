import * as argon from "argon2";
import { ResolverFn } from "../../../../typing";
import config from "../../../config";
import { passwordChangeMail } from "../../../data/emailData";
import emailer from "../../../utils/emailer";
import { UnauthorizedException } from "../../../utils/exceptions";
import redisGet from "../../../utils/redisGet";
import signToken from "../signToken";
import { TokenType } from "./register";
import { TokenObj } from "./validate_code";

interface Args {
  input: {
    name: string;
    email: string;
    password: string;
    token: string;
  };
}
const changePassword: ResolverFn<Args, TokenType> = async (_, args, ctx) => {
  try {
    const { email, password, name, token } = args.input;

    const { db, req, redis } = ctx;

    const user = await ctx.db.users.findOne({
      where: { email },
      select: ["id", "email"],
    });

    if (!user) throw new Error("User not found");

    const key = `validate-user:${email}:${name}`;

    const redisCache = await redisGet<TokenObj>(key);

    if (!redisCache) throw UnauthorizedException("Unauthorized access");

    if (redisCache.token !== token)
      throw UnauthorizedException("Invalid token");

    const hash = argon.hash(password);

    const updatedUser = await db.users.updateOne(
      { email, name },
      { $set: { password: hash } }
    );

    if (!updatedUser) throw new Error("Something went wrong");

    await redis.del(key);

    await emailer({
      to: email,
      subject: "Your password was changed",
      html: passwordChangeMail({ name, email }),
    });

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
export default changePassword;
