import { Schema, model } from "mongoose";
import type { CategoryType } from "../../typing";

const categorySchema = new Schema<CategoryType>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { id: true }
);

export default model<CategoryType>("categories", categorySchema);
