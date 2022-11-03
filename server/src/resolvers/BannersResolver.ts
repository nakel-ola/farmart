import type { Upload } from "graphql-upload-minimal";
import xss from "xss";
import ImageUplaod, { ImageUploadType } from "../helper/ImageUpload";
import authenticated from "../middleware/authenticated";
import db from "../models";
import type { ReqBody } from "../typing";
import type { CreateBannerArgs, EditBannerArgs } from "../typing/banners";
import type { Msg } from "../typing/custom";

const banners = async () => {
  const data = await db.bannerSchema.find();
  return data;
};

const createBanner = authenticated(
  async (args: CreateBannerArgs, req: ReqBody): Promise<Msg> => {
    try {
      let admin = req.admin,
        image = args.input.image,
        title = xss(args.input.title),
        description = xss(args.input.description),
        link = xss(args.input.link);

      if (!admin) {
        throw new Error("You don't have permission");
      }

      const newImage = await ImageUplaod(image.file);

      await db.bannerSchema.create({
        image: newImage.url,
        link,
        title,
        description,
      });

      return { msg: "Banner created successfully" };
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

const deleteBanner = authenticated(
  async (args: { id: string }, req: ReqBody): Promise<Msg> => {
    try {
      let admin = req.admin,
        id = args.id;

      if (!admin) {
        throw new Error("You don't have permission");
      }

      await db.bannerSchema.deleteOne({ _id: id });

      return { msg: "Banner deleted successfully" };
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

const editBanner = authenticated(async (args: EditBannerArgs, req: ReqBody) => {
  try {
    let admin = req.admin,
      id = xss(args.input.id),
      isString = typeof args.input.image === "string",
      image = isString ? xss(args.input.image.toString()) : args.input.image,
      title = xss(args.input.title),
      description = xss(args.input.description),
      link = xss(args.input.link);

    if (!admin) {
      throw new Error("You don't have permission");
    }

    const newImage = isString ? image : await ImageUplaod((image as Upload).file!);

    await db.bannerSchema.updateOne(
      { _id: id },
      {
        image: isString ? newImage : (newImage as ImageUploadType).url!,
        link,
        title,
        description,
      }
    );

    return { msg: "Banner created successfully" };
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
});

export default {
  banners,
  createBanner,
  deleteBanner,
  editBanner
};
