import { MsgType, ResolverFn } from "../../../../typing";

const logout: ResolverFn<any, MsgType> = async (_, args, ctx) => {
  try {
    const { req } = ctx;
    return { message: "Logout successful" };
  } catch (err: any) {
    console.log(err);
    throw new Error(err);
  }
};
export default logout;
