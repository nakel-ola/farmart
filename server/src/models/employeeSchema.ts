import { model, Schema, SchemaTypes } from "mongoose";

const employeeSchema = new Schema(
  {
    email: {
      type: SchemaTypes.String,
      required: true,
    },
    name: {
      type: SchemaTypes.String,
      required: true,
    },
    photoUrl: {
      type: SchemaTypes.String,
      required: false,
    },
    password: {
      type: SchemaTypes.String,
      required: true,
    },
    gender: {
      type: SchemaTypes.String,
      required: true,
    },
    birthday: {
      type: SchemaTypes.Date,
      required: false,
    },
    phoneNumber: {
      type: SchemaTypes.String,
      required: true,
    },
    level: {
      type: SchemaTypes.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("employees", employeeSchema);
