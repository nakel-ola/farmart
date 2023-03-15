import type { FileUpload } from "graphql-upload-minimal";
import { upload } from "./upload-blob";

interface Args {
  file: Promise<FileUpload>;
}
const uploadFile = async (_: any, args: Args) => {
  const { file } = args;
  const newFile = await file;
  const url = await upload(newFile);

  return url;
};
export default uploadFile;
