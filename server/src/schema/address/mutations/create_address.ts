import { MsgType, ResolverFn } from "../../../../typing";
import getdel from "../../../utils/getdel";

interface Args {
  input: {
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

const createAddress: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { db, user } = ctx;

    const userId = user?.id.toString();

    const address = await db.addresses
      .create({
        ...args.input,
        userId,
        default: false,
      })
      .save();

    if (!address) throw new Error("Something went wrong");

    await getdel([`addresses:${userId}*`, `address:${userId}*`]);

    return { message: "Successfully added address" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default createAddress;
