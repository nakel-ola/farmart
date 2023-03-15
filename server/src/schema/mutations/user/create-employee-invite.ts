import type { Level, MsgType, ResolverFn } from "../../../../typing";
import config from "../../../config";
import { invitationMail } from "../../../data/emailData";
import emailer from "../../../helper/emailer";
import { nanoid } from "../../../helper/nanoid";

interface Args {
  input: {
    email: string;
    level: Level;
  };
}

const createEmployeeInvite: ResolverFn<Args, Promise<MsgType>> = async (
  _,
  args,
  ctx
) => {
  try {
    const { email, level } = args.input;
    const { db, redis } = ctx;

    const inviteCode = nanoid(5),
      status = "pending";

    let link = `${config.admin_url}/?type=sign&code=${inviteCode}`;

    await db.invites.create({ email, level, status, inviteCode });

    console.log(link);

    // await emailer({
    //   from: config.email_from,
    //   to: email,
    //   subject: `Your ${config.app_name} app verification code`,
    //   html: invitationMail({ link }),
    // });

    await redis.del("employee-invites");

    return { message: "Invite sent successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default createEmployeeInvite;
