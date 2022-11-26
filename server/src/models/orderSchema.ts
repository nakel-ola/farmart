import { Schema, model } from "mongoose";
import { addressSchema } from "./userSchema";

const couponSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    email: {
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
    code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const productSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const progressSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    required: true,
  }
},{ timestamps: true });

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    deliveryMethod: {
      type: String,
      required: true,
    },
    address: {
      type: addressSchema,
      required: false,
    },
    pickup: {
      type: String,
      required: false,
    },
    products: {
      type: [productSchema],
      required: true,
    },
    trackingId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    progress: {
      type: [progressSchema],
      required: true,
    },
    shippingFee: {
      type: String,
      required: false
    },
    coupon: {
      type: couponSchema,
      required: false
    },
    phoneNumber: {
      type: String,
      required: false
    },
  },
  { timestamps: true }
);

export default model("orders", orderSchema);
