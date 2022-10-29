import { Schema, model } from "mongoose";

const couponSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false
  },
  userId: {
    type: String,
    required: true,
  },
  expiresIn: {
    type: Date,
    required: true,
  },
},{ timestamps: true });

export default model('coupons', couponSchema)
