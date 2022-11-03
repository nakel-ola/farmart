import { model, Schema } from "mongoose";

const validateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    validationToken: {
      type: String,
      required: true,
    },
    expiresIn: {
      type: Date,
      required: true,
      expires: 300
    },
  },
  { timestamps: true }
);

export default model("validate", validateSchema);
