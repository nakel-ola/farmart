import { model, Schema } from "mongoose";

const inboxSchema = new Schema({
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
}, { timestamps: true });

export default model("inboxes", inboxSchema);
