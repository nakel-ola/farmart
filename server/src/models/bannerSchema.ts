import { model, Schema } from "mongoose";

const bannerSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default model("banners", bannerSchema);
