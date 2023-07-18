import { ResolverFn } from "../../../../typing";
import { UnauthorizedException } from "../../../utils/exceptions";
import redisGet from "../../../utils/redisGet";

interface Args {
  input: {
    email: string;
    token: string;
    name: string;
  };
}
export interface TokenObj {
  email: string;
  token: string;
}

const validateCode: ResolverFn = async (_, args, ctx) => {
  try {
    const { email, name, token } = args.input;

    const { db } = ctx;

    const user = await db.users.findOne({ where: { email } });

    if (!user) throw UnauthorizedException("User not found");

    const key = `validate-user:${email}:${name}`;

    const redisCache = await redisGet<TokenObj>(key);

    if (!redisCache) return { validate: false };

    if (redisCache.token === token) return { validate: true };
    else return { validate: false };
  } catch (error: any) {}
};
export default validateCode;
