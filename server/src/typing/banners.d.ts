import type { Upload } from "graphql-upload-minimal";

export type CreateBannerArgs = {
  input: {
    link: string;
    image: Upload;
  };
};
