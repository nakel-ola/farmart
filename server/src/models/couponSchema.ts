import { Schema, model } from "mongoose";
import type { CouponType } from "../../typing";



const couponSchema = new Schema<CouponType>({
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

export default model<CouponType>('coupons', couponSchema)
