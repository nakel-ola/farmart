import type { HydratedDocument } from "mongoose";
import type {
  InviteType,
  MsgType,
  ResolverFn,
  UserType,
} from "../../../../typing";
import config from "../../../config";
import { welcomeMsg } from "../../../data/emailData";
import emailer from "../../../helper/emailer";
import { ForbiddenException } from "../../../helper/exceptions";
import generateHash from "../../../helper/generateHash";
import signToken from "../../../helper/signToken";

interface Args {
  input: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    inviteCode?: string;
  };
}

const register: ResolverFn<Args, Promise<MsgType>> = async (_, args, ctx) => {
  try {
    const { email, name, password, phoneNumber, inviteCode } = args.input;

    const { db, req } = ctx;

    let validate: HydratedDocument<InviteType> | null = null;

    if(req.admin && !inviteCode) throw new Error("Invite code is required")

    if (req.admin) {
      validate = await db.invites.findOne({ email, inviteCode });

      if (!validate) throw new Error("Something went wrong");
    }

    const user = await db.users.findOne({ email }, { email: 1 });

    if (user) throw ForbiddenException(`User ${user.email} already exists`);

    const hash = generateHash(password);

    let obj = {
      name,
      email,
      phoneNumber,
      password: hash,
      gender: null,
      photoUrl: null,
      birthday: null,
      addresses: [],
      blocked: false,
      level: req.admin ? validate?.level : null,
    };

    const newUser: HydratedDocument<UserType> = await db.users.create(obj);

    const token = signToken(newUser._id.toString(), email);

    (req.session as any).auth = token;

    await emailer({
      from: config.email_from,
      to: email,
      subject: `Welcome to the ${config.app_name} family!`,
      text: "",
      html: welcomeMsg({ name }),
    });

    return { message: "Registration successful" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default register;
