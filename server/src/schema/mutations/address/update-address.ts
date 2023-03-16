import type { MsgType, ResolverFn } from "../../../../typing";
import clean from "../../../helper/clean";
import getdel from "../../../helper/getdel";

interface Args {
  input: {
    id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    country: string;
    info?: string;
    phoneNumber: string;
    phoneNumber2?: string;
  };
}
const updateAddress: ResolverFn<Args, Promise<MsgType>> = async (
  _,
  args,
  ctx
) => {
  try {
    const { id, ...others } = args.input;

    const { db, user } = ctx;

    const userId = user?._id.toString();

    await db.addresses.updateOne({ userId, _id: id }, clean(others));

    await getdel([`addresses:${userId}*`, `*address:${userId}*`]);

    return { message: "Address updated successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default updateAddress;
