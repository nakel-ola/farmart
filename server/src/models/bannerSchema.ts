import { model, Schema } from "mongoose";

const bannerSchema = new Schema(
  {
    title: {
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
    link: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default model("banners", bannerSchema);
