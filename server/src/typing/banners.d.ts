import type { Upload } from "graphql-upload-minimal";

export type CreateBannerArgs = {
  input: {
    title: string;
    description: string;
    link: string;
    image: Upload;
  };
};
