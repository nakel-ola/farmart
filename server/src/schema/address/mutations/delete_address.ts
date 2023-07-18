import { ObjectId } from "mongodb";
import { MsgType, ResolverFn } from "../../../../typing";
import getdel from "../../../utils/getdel";

interface Args {
  id: string;
}

const deleteAddress: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { db, user } = ctx;

    const userId = user?.id.toString();

    await db.addresses.deleteOne({ _id: new ObjectId(args.id), userId });

    await getdel([`addresses:${userId}*`, `*address:${userId}*`]);

    return { message: "Address deleted successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default deleteAddress;
