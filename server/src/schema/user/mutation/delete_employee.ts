import { MsgType, ResolverFn } from "../../../../typing";
import { ObjectId } from "mongodb";

interface Args {
  id: string;
}

const deleteEmployee: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { db } = ctx;

    await db.users.deleteOne({ _id: new ObjectId(args.id) });

    return { message: "Employee deleted successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default deleteEmployee;
