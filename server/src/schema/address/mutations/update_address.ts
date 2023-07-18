import { ObjectId } from "mongodb";
import { MsgType, ResolverFn } from "../../../../typing";
import clean from "../../../utils/clean";
import getdel from "../../../utils/getdel";

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
const updateAddress: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { id, ...others } = args.input;

    const { db, user } = ctx;

    const userId = user?.id.toString();

    await db.addresses.updateOne(
      { userId, _id: new ObjectId(id) },
      { $set: clean(others) }
    );

    await getdel([`addresses:${userId}*`, `*address:${userId}*`]);

    return { message: "Address updated successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default updateAddress;
