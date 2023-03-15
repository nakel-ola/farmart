import { Schema, SchemaTypes, model } from "mongoose";
import type { AddressType } from "../../typing";

const addressSchema = new Schema<AddressType>(
  {
    userId: {
      type: SchemaTypes.String,
      required: true,
    },
    name: {
      type: SchemaTypes.String,
      required: true,
    },
    street: {
      type: SchemaTypes.String,
      required: true,
    },
    city: {
      type: SchemaTypes.String,
      required: true,
    },
    state: {
      type: SchemaTypes.String,
      required: true,
    },
    country: {
      type: SchemaTypes.String,
      required: true,
    },
    info: {
      type: SchemaTypes.String,
      required: false,
    },
    phoneNumber: {
      type: SchemaTypes.String,
      required: true,
    },
    phoneNumber2: {
      type: SchemaTypes.String,
      required: false,
    },
    default: {
      type: SchemaTypes.Boolean,
      required: false,
    },
  },
  { timestamps: true }
);


export { addressSchema };

export default model<AddressType>("addresses", addressSchema);
