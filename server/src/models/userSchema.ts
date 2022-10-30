import { Schema, model, SchemaTypes } from "mongoose";

const addressSchema = new Schema({
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
  }
}, { timestamps: true })

const userSchema = new Schema({
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
  addresses: {
    type: [addressSchema],
    required: false,
  },
  blocked: {
    type: SchemaTypes.Boolean,
    default: false,
    required: true,
  }
}, { timestamps: true, });


export {
  addressSchema
}

export default model('users', userSchema)
