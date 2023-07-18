import { JwtPayload, verify } from "jsonwebtoken";
import { ResolverFn } from "../../../../typing";
import config from "../../../config";
import signToken from "../signToken";


type ReturnToken = {
  accessToken: string;
};

const refresh: ResolverFn<any, ReturnToken> = async (_, args, ctx) => {
  try {
    if (!ctx.req.headers["x-refresh-token"])
      throw new Error(`Refresh token not provided`);

    const token = ctx.req.headers["x-refresh-token"] as any;

    const decodedToken = verify(token, config.jwt_secret!) as JwtPayload;

    if (!decodedToken) throw new Error(`Refresh token not provided`);

    const user = await ctx.userLoader.load(decodedToken.sub);

    const accessToken = signToken(user.id.toString(), user.email);

    return { accessToken };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export default refresh;
