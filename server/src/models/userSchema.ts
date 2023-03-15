import { Schema, SchemaTypes, model } from "mongoose";
import type {  UserType } from "../../typing";


const userSchema = new Schema<UserType>(
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
      required: false,
    },
    birthday: {
      type: SchemaTypes.Date,
      required: false,
    },
    phoneNumber: {
      type: SchemaTypes.String,
      required: true,
    },
    blocked: {
      type: SchemaTypes.Boolean,
      default: false,
      required: true,
    },
    level: {
      type: SchemaTypes.String,
      required: false,
    },
  },
  { timestamps: true }
);

export default model<UserType>("users", userSchema);
