import type { MsgType, ResolverFn } from "../../../../typing";
import config from "../../../config";
import { passwordChangeMail } from "../../../data/emailData";
import emailer from "../../../helper/emailer";
import { UnauthorizedException } from "../../../helper/exceptions";
import generateHash from "../../../helper/generateHash";
import redisGet from "../../../helper/redisGet";
import signToken from "../../../helper/signToken";
import type { TokenObj } from "./forget-password";

interface Args {
  input: {
    name: string;
    email: string;
    password: string;
    token: string;
  };
}

const changePassword: ResolverFn<Args, Promise<MsgType>> = async (
  _,
  args,
  ctx
) => {
  try {
    const { email, password, name, token } = args.input;

    const { db, req, redis } = ctx;

    const user = await ctx.db.users.findOne(
      { email },
      { id: true, email: true }
    );

    if (!user) throw new Error("User not found");

    const key = `validate-user:${email}:${name}`;

    const redisCache = await redisGet<TokenObj>(key);

    if (!redisCache) throw UnauthorizedException("Unauthorized access");

    if (redisCache.token !== token)
      throw UnauthorizedException("Invalid token");

    const hash = generateHash(password);

    const updatedUser = await db.users.updateOne(
      { email, name },
      { password: hash }
    );

    if (!updatedUser) throw new Error("Something went wrong");

    const jwtToken = signToken(user._id.toString(), email);

    (req.session as any).auth = jwtToken;

    await redis.del(key)

    await emailer({
      from: config.email_from,
      to: email,
      subject: "Your password was changed",
      html: passwordChangeMail({ name, email }),
    });

    return { message: "Password changed successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default changePassword;
