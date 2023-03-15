import { Schema, model } from "mongoose";
import type { FavoriteType } from "../../typing";


const favoriteSchema = new Schema<FavoriteType>({
  userId: {
    type: String,
    required: true,
  },
  data: {
    type: [String],
    required: true,
  },
});

export default model<FavoriteType>("favorites", favoriteSchema);
