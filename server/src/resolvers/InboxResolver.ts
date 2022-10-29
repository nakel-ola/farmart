import mongoose from "mongoose";
import xss from "xss";
import authenticated from "../middleware/authenticated";
import db from "../models";
import type { Msg } from "../typing/custom";
import type {
  CreateInboxArgs,
  InboxArgs,
  InboxData,
  ModifyInboxArgs,
} from "../typing/inbox";
import type { ReqBody } from "../typing";

const inboxes = authenticated(
  async (args: InboxArgs, req: ReqBody): Promise<InboxData> => {
    try {
      let userId = req.userId,
        customerId = xss(args.input.customerId),
        page = Number(xss(args.input.page.toString() ?? "1")),
        limit = Number(xss(args.input.limit.toString() ?? "10")),
        start = (page - 1) * limit,
        end = limit + start;


      if (customerId && !mongoose.Types.ObjectId.isValid(customerId)) {
        throw new Error("ID must be a valid");
      }

      const data = await db.inboxSchema.find(customerId ? { userId: customerId }: {userId});


      return {
        page,
        totalItems: data.length,
        results: data.slice(start, end),
      };
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

const createInbox = authenticated(
  async (args: CreateInboxArgs, req: ReqBody): Promise<Msg> => {
    try {
      let admin = req.admin,
        title = xss(args.input.title),
        description = xss(args.input.description),
        userId = xss(args.input.userId);

      if (!admin) {
        throw new Error("You don't have permission to create an inbox");
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("ID must be a valid");
      }

      await db.inboxSchema.create({ title, description, userId });

      return {
        msg: "Inbox created successfully",
      };
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

const modifyIndox = authenticated(
  async (args: ModifyInboxArgs, req: ReqBody) => {
    try {
      let admin = req.admin,
        title = xss(args.input.title),
        description = xss(args.input.description),
        id = xss(args.input.id),
        userId = xss(args.input.userId);

      if (!admin) {
        throw new Error("You don't have permission to create an inbox");
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("ID must be a valid");
      }

      await db.inboxSchema.updateOne({ _id: id, userId }, { title, description });

      return {
        msg: "Inbox modify successfully"
      }

    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

export default {
  inboxes,
  createInbox,
  modifyIndox
};
