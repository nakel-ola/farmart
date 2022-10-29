import { Schema, model } from "mongoose";

const favoriteSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  data: {
    type: [String],
    required: true,
  },
});

export default model("favorites", favoriteSchema);
