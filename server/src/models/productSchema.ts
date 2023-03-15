import { Schema, model } from "mongoose";
import type { CurrencyType, ProductType, RatingType } from "../../typing";

const ratingSchema = new Schema<RatingType>({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const currencySchema = new Schema<CurrencyType>({
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

const productSchema = new Schema<ProductType>(
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
      type: String,
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
  },
  {
    timestamps: true,
  }
);
export default model<ProductType>("products", productSchema);
