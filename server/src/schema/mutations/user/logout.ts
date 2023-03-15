import type { ResolverFn } from "../../../../typing";

const logout: ResolverFn<any> = async (_, args, ctx) => {
  try {
    const { req } = ctx;

    req.session.destroy((err) => {
      if (err) throw new Error(err.message);
    });

    return { msg: "Logout successful" };
  } catch (err: any) {
    console.log(err);
    throw new Error(err);
  }
};

export default logout;
