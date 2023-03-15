import type { ResolverFn } from "../../../../typing";

interface Args {
  id: string;
}
const deleteEmployee: ResolverFn<Args> = async (_, args, ctx) => {
  try {
    const { db } = ctx;

    await db.users.deleteOne({ _id: args.id });

    return { message: "Employee deleted successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default deleteEmployee;
