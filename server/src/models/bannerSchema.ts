import { model, Schema } from "mongoose";
import type { BannerType } from "../../typing";



const bannerSchema = new Schema<BannerType>(
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

export default model<BannerType>("banners", bannerSchema);
