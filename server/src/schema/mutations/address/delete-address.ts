import type { MsgType, ResolverFn } from "../../../../typing";
import getdel from "../../../helper/getdel";

interface Args {
  id: string;
}
const deleteAddress: ResolverFn<Args, Promise<MsgType>> = async (
  _,
  args,
  ctx
) => {
  try {
    const { db, user } = ctx;

    const userId = user?._id.toString();

    await db.addresses.deleteOne({ _id: args.id, userId });

    await getdel([`addresses:${userId}*`, `*address:${userId}*`]);

    return { message: "Address deleted successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default deleteAddress;
