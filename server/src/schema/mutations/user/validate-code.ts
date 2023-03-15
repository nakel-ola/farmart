import type { Context } from "../../../../typing";
import redisGet from "../../../helper/redisGet";
import type { TokenObj } from "./forget-password";

interface Args {
  input: {
    email: string;
    token: string;
    name: string;
  };
}

const validateCode = async (_: any, args: Args, ctx: Context) => {
  try {
    const { email, name, token } = args.input;

    const { db } = ctx;

    const user = await db.users.findOne({ email });

    if (!user) throw new Error("User not found");

    const key = `validate-user:${email}:${name}`;

    const redisCache = await redisGet<TokenObj>(key);

    if (!redisCache) return { validate: false };

    console.log(redisCache);

    if (redisCache.token === token) return { validate: true };
    else return { validate: false };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default validateCode;
