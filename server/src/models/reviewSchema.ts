import { Schema, model } from "mongoose";
import type { ReviewType } from "../../typing";

const reviewSchema = new Schema<ReviewType>({
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

export default model<ReviewType>("reviews", reviewSchema);
