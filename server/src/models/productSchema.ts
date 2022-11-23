import { model, Schema } from "mongoose";


const reviewSchema = new Schema({
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
    required: true
  },
  userId: {
    type: String,
    required: true,
  },
});

const ratingSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const imageSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: true,
  },
});

const currencySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  symbolNative: {
    type: String,
    required: false,
  },
  decimalDigits: {
    type: Number,
    required: true,
  },
  rounding: {
    type: Number,
    required: false,
  },
  code: {
    type: String,
    required: true,
  },
  namePlural: {
    type: String,
    required: true,
  },
});

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: imageSchema,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    rating: {
      type: [ratingSchema],
      required: true,
    },
    discount: {
      type: String,
      required: false,
    },
    currency: {
      type: currencySchema,
      required: true,
    },
    reviews: {
      type: [reviewSchema],
      required: false,
    },
  },
  { timestamps: true }
);

export default model("products", productSchema);
