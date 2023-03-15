import type { FileUpload } from "graphql-upload-minimal";
import { upload } from "./upload-blob";

interface Args {
  files: Promise<FileUpload>[];
}
const uploadFiles = async (_: any, args: Args) => {
  const { files } = args;
  const urls: { url: string }[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = await files[i];

    const url = await upload(file);
    urls.push(url);
  }

  return urls;
};
export default uploadFiles;
