import type { ResolverFn } from "../../../../typing";
import config from "../../../config";
import { verificationMail } from "../../../data/emailData";
import emailer from "../../../helper/emailer";
import { NotFoundException } from "../../../helper/exceptions";
import generateCode from "../../../helper/generateCode";

interface Args {
  input: {
    email: string;
    name: string;
  };
}
export interface TokenObj {
  email: string;
  token: string;
}

const forgetPassword: ResolverFn<Args, Promise<{ token: string }>> = async (
  _,
  args,
  ctx
) => {
  try {
    const { email, name } = args.input;

    const { db } = ctx;

    let token = generateCode(11111, 99999);

    const user = await db.users.findOne({ email, name });

    if (!user) throw NotFoundException("User not found");

    const key = `validate-user:${email}:${name}`;

    let obj = { email, token };

    await ctx.redis.setex(key, 600, JSON.stringify(obj));

    await emailer({
      from: config.email_from,
      to: email,
      subject: `Your ${config.app_name} app verification code`,
      html: verificationMail({ code: token, name }),
    });

    console.log(token);

    return { token: token.toString() };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default forgetPassword;
