import { createWriteStream } from "fs";
import type { FileUpload } from "graphql-upload-minimal";
import { join } from "path";
import { nanoid } from "../../../helper/nanoid";

interface Args {
  blob: Promise<FileUpload>;
}
const uploadBlob = async (_: any, args: Args) => {
  const { blob } = args;

  const { createReadStream, encoding, fieldName, mimetype } = await blob;

  const filename = nanoid() + "." + mimetype.split("/")[1];

  const url = await upload({
    createReadStream,
    encoding,
    filename,
    mimetype,
    fieldName,
  });

  return url;
};

export const upload = async (file: FileUpload) => {
  const { createReadStream, filename } = file;
  const stream = createReadStream();
  const url = `http://localhost:4000/uploads/${filename}`;

  const filePath = join(__dirname, "../../../../public/uploads", filename);

  return new Promise<{ url: string }>((resolve, reject) => {
    stream
      .pipe(createWriteStream(filePath))
      .on("error", (err: any) => reject(err))
      .on("finish", () => resolve({ url }));
  });
};
export default uploadBlob;
