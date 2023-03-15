import { model, Schema } from "mongoose";
import type { ValidateType } from "../../typing";


const validateSchema = new Schema<ValidateType>(
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

const validate = model<ValidateType>("validate", validateSchema);

export default validate;
