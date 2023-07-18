import { ResolverFn } from "../../../../typing";
import config from "../../../config";
import { verificationMail } from "../../../data/emailData";
import emailer from "../../../utils/emailer";
import { NotFoundException } from "../../../utils/exceptions";
import generateCode from "../../../utils/generateCode";

interface Args {
  input: {
    email: string;
    name: string;
  };
}

const forgetPassword: ResolverFn<Args, { token: string }> = async (
  _,
  args,
  ctx
) => {
  try {
    const { email, name } = args.input;

    const { db } = ctx;

    let token = generateCode(11111, 99999);

    const user = await db.users.findOne({ where: { email, name } });

    if (!user) throw NotFoundException("User not found");

    const key = `validate-user:${email}:${name}`;

    let obj = { email, token };

    await ctx.redis.setex(key, 600, JSON.stringify(obj));

    await emailer({
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
