import type { Upload } from "graphql-upload-minimal";

export type CreateBannerArgs = {
  input: {
    title: string;
    description: string;
    link: string;
    image: Upload;
  };
};
export type EditBannerArgs = {
  input: {
    id: string;
    title: string;
    description: string;
    link: string;
    image: Upload | string;
  };
};
