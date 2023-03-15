import { Schema, model } from "mongoose";
import type { InviteType } from "../../typing";

const inviteSchema = new Schema<InviteType>(
  {
    email: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    inviteCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<InviteType>("invites", inviteSchema);
