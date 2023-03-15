import { model, Schema } from "mongoose";
import type { InboxType } from "../../typing";

const inboxSchema = new Schema<InboxType>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<InboxType>("inboxes", inboxSchema);
